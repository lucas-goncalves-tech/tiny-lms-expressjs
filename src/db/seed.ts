import { drizzle } from "drizzle-orm/better-sqlite3";
import DatabaseDriver from "better-sqlite3";
import * as schema from "./schema";
import { envCheck } from "../shared/helper/env-check.helper";
import { CryptoService } from "../shared/security/crypto-service.security";

const sqlite = new DatabaseDriver(envCheck().DB_FILE_NAME);
sqlite.pragma("foreign_keys = ON");
const db = drizzle(sqlite, { schema });

const usersData = [
  ...Array.from({ length: 5 }).map((_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: "USER",
  })),
];

const video = `${envCheck().UPLOAD_DEST}/video.mp4`;

const coursesData = [
  {
    slug: "html-e-css",
    title: "HTML e CSS",
    description: "Curso de HTML e CSS para Iniciantes",
  },
  {
    slug: "javascript-completo",
    title: "JavaScript Completo",
    description: "Curso completo de JavaScript",
  },
];

const lessonsData = [
  // HTML e CSS
  {
    courseSlug: "html-e-css",
    slug: "tags-basicas",
    title: "Tags Básicas",
    seconds: 200,
    video,
    description: "Aula sobre as Tags Básicas",
    order: 1,
  },
  {
    courseSlug: "html-e-css",
    slug: "estrutura-do-documento",
    title: "Estrutura do Documento",
    seconds: 420,
    video,
    description: "Estrutura básica: <!DOCTYPE>, <html>, <head> e <body>.",
    order: 2,
  },
  {
    courseSlug: "html-e-css",
    slug: "links-e-imagens",
    title: "Links e Imagens",
    seconds: 540,
    video,
    description: "Como usar <a> e <img>, caminhos relativos e absolutos.",
    order: 3,
  },
  {
    courseSlug: "html-e-css",
    slug: "listas-e-tabelas",
    title: "Listas e Tabelas",
    seconds: 600,
    video,
    description: "Listas ordenadas/não ordenadas e estrutura básica de tabelas.",
    order: 4,
  },
  {
    courseSlug: "html-e-css",
    slug: "formularios-basicos",
    title: "Formulários Básicos",
    seconds: 780,
    video,
    description: "Inputs, labels, selects e boas práticas de acessibilidade.",
    order: 5,
  },
  {
    courseSlug: "html-e-css",
    slug: "semantica-e-acessibilidade",
    title: "Semântica e Acessibilidade",
    seconds: 660,
    video,
    description: "Tags semânticas e acessibilidade para iniciantes.",
    order: 6,
  },
  // JavaScript
  {
    courseSlug: "javascript-completo",
    slug: "introducao-e-variaveis",
    title: "Introdução e Variáveis",
    seconds: 480,
    video,
    description: "Como o JS funciona, let/const e escopo.",
    order: 1,
  },
  {
    courseSlug: "javascript-completo",
    slug: "tipos-e-operadores",
    title: "Tipos e Operadores",
    seconds: 540,
    video,
    description: "Tipos primitivos, objetos e operadores comuns.",
    order: 2,
  },
  {
    courseSlug: "javascript-completo",
    slug: "funcoes-basico",
    title: "Funções (Básico)",
    seconds: 600,
    video,
    description: "Declaração, expressão, parâmetros e retorno.",
    order: 3,
  },
  {
    courseSlug: "javascript-completo",
    slug: "manipulando-o-dom",
    title: "Manipulando o DOM",
    seconds: 660,
    video,
    description: "Selecionar, criar e alterar elementos com JS.",
    order: 4,
  },
  {
    courseSlug: "javascript-completo",
    slug: "eventos-no-navegador",
    title: "Eventos no Navegador",
    seconds: 600,
    video,
    description: "addEventListener, propagação e preventDefault.",
    order: 5,
  },
  {
    courseSlug: "javascript-completo",
    slug: "fetch-e-async-await",
    title: "Fetch e Async/Await",
    seconds: 720,
    video,
    description: "Requisições HTTP, Promises e fluxo assíncrono.",
    order: 6,
  },
];

async function seed() {
  // Insert courses
  console.log("📚 Inserindo cursos...");
  const insertedCourses: Record<string, string> = {};

  for (const course of coursesData) {
    const [inserted] = await db
      .insert(schema.courses)
      .values(course)
      .onConflictDoNothing()
      .returning({ id: schema.courses.id, slug: schema.courses.slug })
      .execute();

    if (inserted) {
      insertedCourses[inserted.slug] = inserted.id;
      console.log(`  ✅ ${course.title} (${inserted.id})`);
    }
  }

  // Insert lessons
  console.log("\n📖 Inserindo lições...");
  for (const lesson of lessonsData) {
    const courseId = insertedCourses[lesson.courseSlug];

    if (!courseId) {
      console.log(`  ❌ Curso não encontrado: ${lesson.courseSlug}`);
      continue;
    }
    //eslint-disable-next-line
    const { courseSlug, ...lessonData } = lesson;
    await db
      .insert(schema.lessons)
      .values({
        ...lessonData,
        courseId,
      })
      .execute();

    console.log(`  ✅ ${lesson.title} (${lesson.courseSlug})`);
  }

  console.log("\n📚 Inserindo usuários...");
  const cryptoService = new CryptoService();
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  for (const user of usersData) {
    const hashedPassword = await cryptoService.hash("12345678");
    await delay(600);
    await db
      .insert(schema.users)
      .values({
        name: user.name,
        email: user.email,
        password_hash: hashedPassword,
        role: user.role as "ADMIN" | "USER",
      })
      .onConflictDoNothing()
      .execute();
    console.log(`  ✅ ${user.name} (${user.email})`);
  }

  const hashedPassword = await cryptoService.hash(envCheck().ADMIN_PASSWORD);
  await db
    .insert(schema.users)
    .values({
      name: "Tom Banana",
      email: envCheck().ADMIN_EMAIL,
      password_hash: hashedPassword,
      role: "ADMIN",
    })
    .onConflictDoNothing()
    .execute();
  console.log(`  ✅ ${envCheck().ADMIN_EMAIL} (ADMIN)`);

  console.log("\n🎉 Seed concluído com sucesso!");

  sqlite.close();
}

seed().catch((error) => {
  console.error("❌ Erro no seed:", error);
  process.exit(1);
});
