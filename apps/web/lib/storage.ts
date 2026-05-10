import { S3Client } from "@aws-sdk/client-s3"

/**
 * Cliente S3 configurado para o Cloudflare R2
 * O R2 é 100% compatível com a API do S3, então usamos o SDK oficial da AWS.
 */
export const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
})

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME
export const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_URL // Caso você configure um domínio customizado ou use o .r2.dev
