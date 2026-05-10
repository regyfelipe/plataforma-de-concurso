"use server"

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/storage"
import { generateId } from "better-auth"

type UploadPath = "avatars" | "notebooks" | "careers" | "contests" | "general"

import sharp from "sharp"

export async function uploadToR2(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const path = (formData.get("path") as UploadPath) || "general"

    if (!file || !(file instanceof File)) {
      throw new Error("Arquivo inválido ou não fornecido")
    }
    
    if (!R2_BUCKET_NAME) throw new Error("Bucket R2 não configurado")

    // Ler os bytes do arquivo
    const arrayBuffer = await file.arrayBuffer()
    const inputBuffer = Buffer.from(arrayBuffer)

    // Configurar o processamento com Sharp
    let pipeline = sharp(inputBuffer)
    
    // Redimensionamento inteligente baseado no destino
    if (path === "avatars" || path === "careers" || path === "contests") {
      pipeline = pipeline.resize(400, 400, { fit: "cover" })
    } else {
      pipeline = pipeline.resize(1200, null, { withoutEnlargement: true, fit: "inside" })
    }

    // Converter para WebP com qualidade 80
    const optimizedBuffer = await pipeline
      .webp({ quality: 80 })
      .toBuffer()

    // Nome do arquivo sempre .webp agora
    const fileName = `${path}/${generateId()}.webp`

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: optimizedBuffer,
      ContentType: "image/webp",
    })

    await s3Client.send(command)

    // Retornar a URL pública do arquivo
    const publicUrl = `${R2_PUBLIC_URL}/${fileName}`
    
    return {
      success: true,
      url: publicUrl,
      key: fileName
    }
  } catch (error) {
    console.error("Erro no upload para R2:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido no upload"
    }
  }
}
