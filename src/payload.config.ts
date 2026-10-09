import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { ar } from '@payloadcms/translations/languages/ar'
import { en } from '@payloadcms/translations/languages/en'
import { buildConfig, type Plugin } from 'payload'
import sharp from 'sharp'

import { Articles } from './payload/collections/Articles'
import { ContentApprovals } from './payload/collections/ContentApprovals'
import { FAQs } from './payload/collections/FAQs'
import { Inquiries } from './payload/collections/Inquiries'
import { Media } from './payload/collections/Media'
import { Products } from './payload/collections/Products'
import { PoultrySegments, ProductCategories } from './payload/collections/Taxonomy'
import { Users } from './payload/collections/Users'
import { Homepage } from './payload/globals/Homepage'
import { Metrics } from './payload/globals/Metrics'
import { SiteSettings } from './payload/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'
// SITE_URL is read at runtime (NEXT_PUBLIC_* values are inlined at build time), so one build can serve any origin.
const serverURL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3100'

const secret = process.env.PAYLOAD_SECRET
if (!secret && isProduction) {
  throw new Error('PAYLOAD_SECRET must be set in production.')
}

/**
 * Database: PostgreSQL in production (spec §9.1), SQLite for local development, CI and the isolated
 * e2e fixture database. The adapter is chosen by the DATABASE_URL scheme.
 */
const databaseUrl = process.env.DATABASE_URL || 'file:./data/alshorouk.db'
const usePostgres = /^postgres(ql)?:\/\//.test(databaseUrl)
if (!usePostgres && databaseUrl.startsWith('file:')) {
  fs.mkdirSync(path.dirname(path.resolve(databaseUrl.slice('file:'.length))), { recursive: true })
}

const db = usePostgres
  ? postgresAdapter({
      pool: { connectionString: databaseUrl },
      migrationDir: path.resolve(dirname, 'migrations/postgres'),
      push: false,
    })
  : sqliteAdapter({
      client: { url: databaseUrl },
      migrationDir: path.resolve(dirname, 'migrations/sqlite'),
    })

const plugins: Plugin[] = []
if (process.env.S3_BUCKET) {
  plugins.push(
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET,
      config: {
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT || undefined,
        forcePathStyle: Boolean(process.env.S3_ENDPOINT),
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
        },
      },
    }),
  )
}

export default buildConfig({
  serverURL,
  secret: secret || 'local-development-secret-change-me',
  admin: {
    user: Users.slug,
    theme: 'light',
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' — الشروق CMS',
      robots: 'noindex, nofollow',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' }],
    },
    components: {
      graphics: {
        Logo: '@/payload/components/AdminLogo#AdminLogo',
        Icon: '@/payload/components/AdminLogo#AdminIcon',
      },
    },
  },
  i18n: {
    supportedLanguages: { ar, en },
    fallbackLanguage: 'ar',
  },
  localization: {
    locales: [
      { code: 'ar', label: { ar: 'العربية', en: 'Arabic' }, rtl: true },
      { code: 'en', label: { ar: 'الإنجليزية', en: 'English' } },
    ],
    defaultLocale: 'ar',
    fallback: true,
  },
  collections: [Products, ProductCategories, PoultrySegments, Articles, FAQs, Media, Inquiries, ContentApprovals, Users],
  globals: [Homepage, Metrics, SiteSettings],
  editor: lexicalEditor(),
  db,
  sharp,
  plugins,
  graphQL: { disable: true },
  csrf: [serverURL],
  cors: [serverURL],
  upload: { limits: { fileSize: 10_000_000 } },
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_FROM_ADDRESS ?? 'no-reply@example.invalid',
        defaultFromName: process.env.SMTP_FROM_NAME ?? 'Alshorouk CMS',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT ?? 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        },
      })
    : undefined,
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  telemetry: false,
})
