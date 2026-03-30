import {
  type BinaryLike,
  createHash,
  createHmac,
  randomBytes,
  scrypt,
  type ScryptOptions,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";
import { envCheck } from "../helper/env-check.helper";

type SCRYPT_CONFIG = {
  saltLength: number;
  keyLength: number;
  separator: string;
  params: ScryptOptions;
};

type Scrypt_Async = (
  password: BinaryLike,
  salt: string | Buffer,
  keyLength: number,
  params: ScryptOptions
) => Promise<Buffer>;

type RandomBytes_Async = (size: number) => Promise<Buffer>;

type Normalize = "NFC" | "NFD" | "NFKC" | "NFKD";
type Algorithm = "sha256" | "sha512";

export class CryptoService {
  private readonly SCRYPT_CONFIG: SCRYPT_CONFIG = {
    saltLength: 16,
    keyLength: 32,
    separator: "$",
    params: {
      N: process.env.NODE_ENV === "test" ? 1024 : 2 ** 14,
      r: 8,
      p: 1,
    },
  };
  private readonly scryptAsync: Scrypt_Async = promisify(scrypt);
  public readonly randomBytesAsync: RandomBytes_Async = promisify(randomBytes);
  private readonly PEPPER: string = envCheck().PEPPER;
  private readonly NORM: Normalize = "NFC";
  private readonly ENCODE: BufferEncoding = "hex";
  private readonly ALGORITHM: Algorithm = "sha256";

  private parseHash(storedHash: string) {
    const [stored_salt_hex, stored_dk_hex] = storedHash.split(this.SCRYPT_CONFIG.separator);
    const stored_salt = Buffer.from(stored_salt_hex, this.ENCODE);
    const stored_dk = Buffer.from(stored_dk_hex, this.ENCODE);
    return { stored_salt, stored_dk };
  }

  private createHmac(toEncode: string) {
    const toEncode_normalized = toEncode.normalize(this.NORM);
    return createHmac(this.ALGORITHM, this.PEPPER).update(toEncode_normalized).digest();
  }

  public sha256(data: string | Buffer): Buffer {
    return createHash("sha256").update(data).digest();
  }
  public async hash(password: string) {
    const pasword_hmac = this.createHmac(password);
    const salt_buffer = await this.randomBytesAsync(this.SCRYPT_CONFIG.saltLength);

    const dk_buffer = await this.scryptAsync(
      pasword_hmac,
      salt_buffer,
      this.SCRYPT_CONFIG.keyLength,
      this.SCRYPT_CONFIG.params
    );
    return `${salt_buffer.toString(this.ENCODE)}${this.SCRYPT_CONFIG.separator}${dk_buffer.toString(this.ENCODE)}`;
  }

  public async compareHash(password: string, storedHash: string) {
    const pasword_hmac = this.createHmac(password);
    const { stored_salt, stored_dk } = this.parseHash(storedHash);

    const dk = await this.scryptAsync(
      pasword_hmac,
      stored_salt,
      this.SCRYPT_CONFIG.keyLength,
      this.SCRYPT_CONFIG.params
    );
    return timingSafeEqual(dk, stored_dk);
  }
}
