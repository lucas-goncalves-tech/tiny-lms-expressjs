import { fileTypeFromBuffer } from "file-type";
import path from "node:path";
import { envCheck } from "../../shared/helper/env-check.helper";
import { randomUUID } from "node:crypto";
import { Transform } from "node:stream";
import { BadRequestError } from "../../shared/errors/bad-request.error";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { access, mkdir, rename, rm, stat } from "node:fs/promises";
import { promisify } from "node:util";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import { exec } from "node:child_process";
import { Request, Response } from "express";

export class UploadService {
  private readonly MAX_BYTES_VIDEO = 500 * 1024 * 1024; // 500 mb
  private readonly ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
  private readonly UPLOAD_DEST = envCheck().UPLOAD_DEST;
  private readonly TMP_UPLOAD_DEST = envCheck().TMP_UPLOAD_DEST;
  constructor() {}

  private async getDuration(filePath: string): Promise<number> {
    try {
      const execAsync = promisify(exec);
      const { stdout } = await execAsync(
        `${ffprobeInstaller.path} -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
      );
      return Math.floor(parseFloat(stdout.trim()));
    } catch {
      return 0;
    }
  }

  async save(stream: NodeJS.ReadableStream, fileName: string) {
    const ext = path.extname(fileName) || ".mp4";
    const uniqueName = `${randomUUID()}${ext}`;
    const tmpPath = path.join(this.TMP_UPLOAD_DEST, `/${uniqueName}.tmp`);
    const finalPath = path.join(this.UPLOAD_DEST, `/${uniqueName}`);

    let fileSize = 0;
    let isFirstChunk = true;
    const maxBytes = this.MAX_BYTES_VIDEO;
    const allowedTypes = this.ALLOWED_VIDEO_TYPES;

    const validator = new Transform({
      async transform(chunk, _enc, next) {
        fileSize += chunk.length;

        if (fileSize > maxBytes) {
          next(
            new BadRequestError(`Tamanho de arquivo ultrapassa os ${maxBytes / (1024 * 1024)}mb`)
          );
          return;
        }

        if (isFirstChunk) {
          isFirstChunk = false;
          const fileType = await fileTypeFromBuffer(chunk);

          if (!fileType || !allowedTypes.includes(fileType?.mime)) {
            next(new BadRequestError(`Somente ${allowedTypes.join(", ")} são permitidos`));
          }
        }

        next(null, chunk);
      },
    });

    await mkdir(path.dirname(tmpPath), { recursive: true });
    await mkdir(path.dirname(finalPath), { recursive: true });
    const writeStream = createWriteStream(tmpPath, { flags: "wx" });

    try {
      await pipeline(stream, validator, writeStream);
      await rename(tmpPath, finalPath);
      const seconds = await this.getDuration(finalPath);
      return { path: finalPath, seconds };
    } catch (error) {
      await rm(tmpPath, { force: true }).catch(() => {});
      throw error;
    }
  }

  async rm(filePath: string) {
    const absolutePath = path.resolve(filePath);
    const uploadsDir = path.resolve(this.UPLOAD_DEST);

    if (!absolutePath.startsWith(uploadsDir)) {
      throw new BadRequestError("Path inválido");
    }

    await rm(absolutePath, { force: true });
  }

  async fileExist(filePath: string | null) {
    if (!filePath) return false;
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async streamingVideo(filePath: string, req: Request, res: Response, mimeType = "video") {
    const exists = await this.fileExist(filePath);
    if (!exists) {
      throw new BadRequestError("Arquivo de vídeo não encontrado no servidor.");
    }

    const fileStat = await stat(filePath);
    const fileSize = fileStat.size;
    const range = req.headers.range;

    let fileStream;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      fileStream = createReadStream(filePath, { start, end });

      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": mimeType,
      };

      res.writeHead(206, head);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": mimeType,
      };
      res.writeHead(200, head);
      fileStream = createReadStream(filePath);
    }

    try {
      await pipeline(fileStream, res);
    } catch (error) {
      console.error("Erro no streaming de vídeo:", error);
    }
  }
}
