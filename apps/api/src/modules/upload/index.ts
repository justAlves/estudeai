import Elysia, { t } from "elysia";
import { UploadService } from "./service";

export const uploadController = new Elysia()
  .post("/upload", async ({ body }) => {

    const { file } = body;

    console.log("File received:", file);

    const response = await UploadService.uploadFile(file);

    console.log("File uploaded successfully:", response);

    return {
      message: "File uploaded successfully",
      url: response
    }
  }, {
    body: t.Object({
      file: t.File({ format: "image/*"})
    }),
    response: t.Object({
      message: t.String({ default: "File uploaded successfully" }),
      url: t.String(),
    }),
    auth: true,
    tags: ["Upload"]
  });
