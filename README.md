<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

# Sentinela - Analisis Sentimen Instagram UMKM + Rekomendasi Konten

Sentinela adalah aplikasi untuk membantu UMKM memahami sentimen audiens Instagram dan mendapatkan rekomendasi konten yang lebih tepat sasaran.

Aplikasi ini menyediakan:

- Analisis sentimen komentar Instagram (ABSA)
- Rekomendasi strategi konten UMKM berbasis NLP
- Chatbot untuk menjawab pertanyaan user terkait hasil sentimen
- Penyimpanan data berbasis PostgreSQL + pgvector untuk kebutuhan RAG

## Teknologi

Backend:

- NestJS
- TypeORM
- PostgreSQL + pgvector
- RAG (Retrieval-Augmented Generation)

Frontend:

- React.js

AI/NLP:

- Fine-tuning IndoBERT untuk ABSA (Aspect-Based Sentiment Analysis)
- NLP untuk rekomendasi konten

## Prasyarat

- Node.js `22.13.1` (sesuai `package.json`)
- npm
- Docker + Docker Compose

## Arsitektur Database (Wajib pgvector)

Project ini **wajib** menggunakan PostgreSQL yang memiliki extension `vector` (pgvector).

Di project ini sudah disiapkan image Docker:

- `ankane/pgvector:latest`

`docker-compose.yml` dan `docker-compose.prod.yml` sudah menggunakan image tersebut.

## Konfigurasi Environment

Buat/siapkan file `.env` dengan minimal variabel berikut:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=
DATABASE_NAME=sentinela
DATABASE_SYNCHRONIZE=true
DATABASE_AUTOLOAD=true

JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_ACCESS_TOKEN_TTL=1d
JWT_REFRESH_TOKEN_TTL=7d

GROQ_API_KEY=your-groq-api-key
GOOGLE_API_KEY=your-google-api-key
PORT=8080
```

Catatan:

- Untuk lingkungan production, gunakan secret yang aman dan nonaktifkan `DATABASE_SYNCHRONIZE`.

## Instalasi dan Menjalankan Project

### Opsi A - Jalankan PostgreSQL + pgvector via Docker, backend di host

1. Jalankan database pgvector:

```bash
docker compose up -d db
```

2. Pastikan container sehat:

```bash
docker ps
```

3. Install dependency backend:

```bash
npm install
```

4. Jalankan backend:

```bash
npm run start:dev
```

### Opsi B - Jalankan full stack backend + db via Docker Compose (production style)

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Verifikasi pgvector

Setelah database aktif, verifikasi extension `vector`:

```bash
docker exec -it pgvector_db psql -U postgres -d sentinela -c "CREATE EXTENSION IF NOT EXISTS vector;"
docker exec -it pgvector_db psql -U postgres -d sentinela -c "SELECT extversion FROM pg_extension WHERE extname = 'vector';"
```

## Import SQL Dump

Jika ingin memulihkan data awal dari dump:

File dump yang tersedia:

- `sentinela_dump_2026-05-25.sql`

Import ke database:

```bash
docker exec -i pgvector_db psql -U postgres -d sentinela < sentinela_dump_2026-05-25.sql
```

## Menjalankan Frontend

Frontend menggunakan React.js.

Jika frontend berada di repository terpisah:

1. Masuk ke folder frontend
2. Install dependency (`npm install`)
3. Jalankan (`npm run dev` atau script yang disediakan frontend)
4. Arahkan base URL API ke backend Sentinela

## Struktur Fitur Utama (Backend)

- `auth`: autentikasi dan token
- `users`: manajemen user
- `scraping`: penyimpanan hasil scraping Instagram
- `absa`: analisis sentimen berbasis aspek
- `rag`: retrieval + chatbot untuk insight sentimen

## Script NPM Penting

```bash
npm run start:dev
npm run build
npm run start:prod
npm run test
```

## API Endpoint

Secara default backend berjalan di:

- `http://localhost:8080`

Jika Swagger diaktifkan oleh implementasi app, akses dokumentasi API melalui route Swagger yang dikonfigurasi pada aplikasi.

## Referensi Teknis

- pgvector: aktifkan extension dengan `CREATE EXTENSION vector;`
- NestJS: jalankan aplikasi dengan script npm (`npm run start`, `npm run start:dev`)

## Lisensi

UNLICENSED
