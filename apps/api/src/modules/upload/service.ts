import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../../config/r2";
import { randomUUIDv7 } from "bun";

export abstract class UploadService {
  static async uploadFile(file: File): Promise<string> {
    try {
      const fileKey = randomUUIDv7() + "-" + file.name;

      const buffer = Buffer.from(await file.arrayBuffer());

      await r2.send(
        new PutObjectCommand({
          Bucket: "blackhole-dev",
          Key: fileKey,
          Body: buffer,
          ContentType: file.type,
          ACL: 'public-read', // Deixa o arquivo público
        })
      );

      const publicUrl = `https://pub-d617d3cf14b34a40bb08af35c16dda0d.r2.dev/${fileKey}`;

      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  }
}