import { Request, Response, NextFunction } from "express";
import chalk from "chalk";
import { envCheck } from "../helper/env-check.helper";

/**
 * Middleware de log para requisições HTTP
 * Exibe: METHOD (colorido) | endpoint | tempo de resposta (colorido)
 * + Body, Params e Query quando presentes
 */
export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (envCheck().NODE_ENV === "test") return next();
  const startTime = Date.now();

  // Captura quando a resposta termina
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const method = req.method;
    const endpoint = req.originalUrl || req.url;
    const statusCode = res.statusCode;

    // Cores para métodos HTTP
    const methodColors: Record<string, (text: string) => string> = {
      GET: chalk.green,
      POST: chalk.blue,
      PUT: chalk.yellow,
      PATCH: chalk.cyan,
      DELETE: chalk.red,
      OPTIONS: chalk.gray,
      HEAD: chalk.magenta,
    };

    // Cores para tempo de resposta (performance)
    const getDurationColor = (ms: number): ((text: string) => string) => {
      if (ms < 100) return chalk.green; // Rápido
      if (ms < 500) return chalk.yellow; // Médio
      return chalk.red; // Lento
    };

    // Cores para status code
    const getStatusColor = (status: number): ((text: string) => string) => {
      if (status >= 500) return chalk.red.bold; // Erro do servidor
      if (status >= 400) return chalk.yellow; // Erro do cliente
      if (status >= 300) return chalk.cyan; // Redirecionamento
      if (status >= 200) return chalk.green; // Sucesso
      return chalk.white; // Informacional
    };

    const coloredMethod = (methodColors[method] || chalk.white)(method.padEnd(7));
    const coloredEndpoint = chalk.white(endpoint);
    const coloredDuration = getDurationColor(duration)(`${duration}ms`);
    const coloredStatus = getStatusColor(statusCode)(`[${statusCode}]`);

    // Log principal
    console.log(`${coloredMethod} | ${coloredEndpoint} | ${coloredDuration} ${coloredStatus}`);

    // Exibir dados extras (body, params, query) se existirem
    const hasBody = req.body && Object.keys(req.body).length > 0;
    const hasParams = req.params && Object.keys(req.params).length > 0;
    const hasQuery = req.query && Object.keys(req.query).length > 0;

    if (hasBody || hasParams || hasQuery) {
      console.log(chalk.gray("  ├─ Dados da requisição:"));

      if (hasParams) {
        console.log(
          chalk.cyan("  │  Params:"),
          chalk.white(JSON.stringify(req.params, null, 2).replace(/\n/g, "\n  │         "))
        );
      }

      if (hasQuery) {
        console.log(
          chalk.magenta("  │  Query:"),
          chalk.white(JSON.stringify(req.query, null, 2).replace(/\n/g, "\n  │        "))
        );
      }

      if (hasBody) {
        // Ocultar campos sensíveis (password, token, etc)
        const sanitizedBody = { ...req.body };
        const sensitiveFields = [
          "password",
          "token",
          "secret",
          "apiKey",
          "newPassword",
          "confirmPassword",
          "currentPassword",
        ];
        sensitiveFields.forEach((field) => {
          if (sanitizedBody[field]) {
            sanitizedBody[field] = "***HIDDEN***";
          }
        });

        console.log(
          chalk.blue("  │  Body:"),
          chalk.white(JSON.stringify(sanitizedBody, null, 2).replace(/\n/g, "\n  │       "))
        );
      }

      console.log(chalk.gray("  └─────────────────────────────────"));
    }
  });

  next();
};
