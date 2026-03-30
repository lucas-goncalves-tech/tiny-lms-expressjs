export function envCheck() {
  const PORT = process.env.PORT;
  const DB_FILE_NAME = process.env.DB_FILE_NAME;
  const PEPPER = process.env.PEPPER;
  const UPLOAD_DEST = process.env.UPLOAD_DEST;
  const TMP_UPLOAD_DEST = process.env.TMP_UPLOAD_DEST;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const NODE_ENV = process.env.NODE_ENV;
  const OPENAPI_URL = process.env.OPENAPI_URL;

  if (!PORT) {
    throw new Error("Env PORT não foi definido");
  }

  if (!DB_FILE_NAME) {
    throw new Error("Env DB_FILE_NAME não foi definido");
  }

  if (!PEPPER) {
    throw new Error("Env PEPPER não foi definido");
  }

  if (!TMP_UPLOAD_DEST) {
    throw new Error("Env TMP_UPLOAD_DEST não foi definido");
  }

  if (!UPLOAD_DEST) {
    throw new Error("Env UPLOAD_DEST não foi definido");
  }

  if (!ADMIN_EMAIL) {
    throw new Error("Env ADMIN_EMAIL não foi definido");
  }

  if (!ADMIN_PASSWORD) {
    throw new Error("Env ADMIN_PASSWORD não foi definido");
  }

  if (!NODE_ENV) {
    throw new Error("Env NODE_ENV não foi definido");
  }

  if (!OPENAPI_URL) {
    throw new Error("Env OPENAPI_URL não foi definido");
  }

  return {
    PORT,
    DB_FILE_NAME,
    PEPPER,
    UPLOAD_DEST,
    TMP_UPLOAD_DEST,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    NODE_ENV,
    OPENAPI_URL,
  };
}
