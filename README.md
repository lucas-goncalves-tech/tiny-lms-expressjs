# Tiny LMS Express

API Backend para um Sistema de Gestão de Aprendizagem (LMS) simplificado, desenvolvido com Node.js, Express e TypeScript.

## Quick Start

Siga os passos abaixo para rodar a aplicação localmente de forma rápida:

```bash
# 1. Instale as dependências
yarn install

# 2. Configure as variáveis de ambiente
cp .env.example .env

# 3. Gere o banco de dados interno e o alimente artificialmente (Seed)
yarn db:all

# 4. Inicie o servidor em modo de desenvolvimento
yarn dev
```

A API estará disponível no endereço definido na porta de sua configuração (Padrão: `http://localhost:3333`).
Você poderá acessar a especificação interativa automática via web acessando a documentação da API em `http://localhost:3333/reference` (Depende das configurações de sua instância).

## Features

- **Autenticação Segura:** Autenticação por sessão (Cookie Httponly), senhas criptografadas e restrição de níveis de acesso (Admin/User).
- **Conteúdo em Vídeo Avançado:** Rotas HTTP prontas com suporte à Range Requests e Buffer de streaming para alta performance no Player do frontend, integrado com validadores nativos para mimes multimídia.
- **Micro-Progressão Dinâmica:** Marque aulas como lidas e obtenha seu progresso nos cursos atualizado em requisições de listagem.
- **Certificação Nattiva (PDFs):** Concluiu o curso? A nossa API gera o PDF via `jspdf` programaticamente sem interdependência e disponibiliza o download.
- **Admin Dashboard Total:** Rotas protegidas para exclusão e inserção em tabelas chave para escalar o LMS.
- **Segurança da API Reforçada:** Proteções com Helmet, validações de requisição estritas via DTOs/Zod para inibir ataques de Injeção estrutural.

## Configuration

A aplicação deve ser configurada pelo arquivo `.env`. Um exemplo existe em `.env.example`.

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Porta em que o servidor irá rodar | `3333` |
| `DB_FILE_NAME` | Nome/local do arquivo local SQLite | `sqlite.db` |
| `PEPPER` | Segredo para adição de salt na criptografia de senhas | `generate-a-random-secret-key` |
| `UPLOAD_DEST` | Caminho persistente onde mídias dos cursos serão salvas | `/uploads` |
| `TMP_UPLOAD_DEST` | Repositório temporário de submissão multipart | `/uploads/tmp` |
| `ADMIN_EMAIL` | Credencial para seeder gerar o admin padrão | `admin@admin.com` |
| `ADMIN_PASSWORD` | Senha inicial de acesso administrativo | `123123123` |
| `NODE_ENV` | Define o estágio de runtime (`development` ou `production`) | `development` |
| `OPENAPI_URL` | Define a URL base que será apontada a doc Zod Openapi | `http://localhost:3333/api/v1` |
| `FRONTEND_URL` | Destino explícito livre para bloqueio natural do CORS | `http://localhost:3001` |

## Documentation

Para maior fluidez o sistema é 100% mapeado nativamente e reage a modificações dos Schemas de validação de parâmetros da requisição.
Você pode visualizar a interface técnica referencial subindo a aplicação e engatando na rota da documentação construída diretamente sobre OpenAPI.

- **API Reference**: Swagger OpenApi e definições modulares se encontram dentro dos arquivos `.doc.ts` em `src/features/**`.

### Api Endpoints & Lockout

| Method | Endpoint | Lockout (Auth Req) | Description |
|--------|----------|--------------------|-------------|
| **POST** | `/auth/register` | 🔓 Público | Cria um novo usuário |
| **POST** | `/auth/login` | 🔓 Público | Realiza login na plataforma |
| **GET** | `/auth/me` | 🔒 Autenticado | Retorna os dados do usuário atual (Sessão) |
| **DELETE** | `/auth/logout` | 🔒 Autenticado | Remove o cookie da sessão atual |
| **PUT** | `/user/password/update` | 🔒 Autenticado | Troca de senha exigindo senha atual |
| **PUT** | `/user/email/update` | 🔒 Autenticado | Atualização de email do usuário |
| **GET** | `/courses` | 🔒 Autenticado | Lista todos os cursos c/ progresso |
| **GET** | `/courses/{courseSlug}` | 🔒 Autenticado | Detalha um curso específico |
| **GET** | `/lessons/{courseSlug}` | 🔒 Autenticado | Lista aulas de um curso |
| **GET** | `/lessons/{courseSlug}/{lessonSlug}` | 🔒 Autenticado | Exibe detalhes da aula |
| **GET** | `/lessons/{courseSlug}/{lessonSlug}/video` | 🔒 Autenticado | Streaming segmentado de vídeo (via Header 'Range') |
| **GET** | `/lessons/{courseSlug}/{lessonSlug}/complete` | 🔒 Autenticado | Marca a aula como concluída |
| **DELETE** | `/lessons/{courseSlug}/reset` | 🔒 Autenticado | Reseta o progresso das aulas de um curso |
| **GET** | `/certificates` | 🔒 Autenticado | Lista de certificados emitidos para o usuário |
| **GET** | `/certificates/{certificateId}` | 🔒 Autenticado | Retorna Download Binário (.pdf) do certificado |
| **GET** | `/admin/courses` | 🛑 ADMIN | (Admin) Lista todos os cursos |
| **POST** | `/admin/courses/new` | 🛑 ADMIN | (Admin) Cria recurso de curso |
| **PUT** | `/admin/courses/{courseSlug}/update` | 🛑 ADMIN | (Admin) Atualiza o cadastro do curso |
| **DELETE** | `/admin/courses/{courseSlug}/delete` | 🛑 ADMIN | (Admin) Apaga um curso |
| **GET** | `/admin/lessons/{courseSlug}` | 🛑 ADMIN | (Admin) Lê aulas relativas a um curso |
| **POST** | `/admin/lessons/upload-video` | 🛑 ADMIN | (Admin) Recebe multipart de mídias de vídeo |
| **POST** | `/admin/lessons/{courseSlug}/new` | 🛑 ADMIN | (Admin) Cria os metadados de uma aula |
| **PUT** | `/admin/lessons/{courseSlug}/{lessonSlug}/update` | 🛑 ADMIN | (Admin) Edita info da aula |
| **DELETE** | `/admin/lessons/{courseSlug}/{lessonSlug}/delete` | 🛑 ADMIN | (Admin) Deleta uma aula |
| **GET** | `/admin/users` | 🛑 ADMIN | (Admin) Ver todos usuários do LMS |
| **POST** | `/admin/users/new` | 🛑 ADMIN | (Admin) Criar credencial de acesso na plataforma |
| **PUT** | `/admin/users/{userId}/update` | 🛑 ADMIN | (Admin) Atualizar de forma forçada um usuário |
| **PATCH** | `/admin/users/{userId}/toggle-active` | 🛑 ADMIN | (Admin) Suspender/Ativar acesso do usuário (`status`) |
| **DELETE** | `/admin/users/{userId}/delete` | 🛑 ADMIN | (Admin) Banir e apagar usuário |

## License

MIT
