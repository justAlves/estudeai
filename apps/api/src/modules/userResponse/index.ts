import { Elysia } from "elysia";
import { UserResponseService } from "./service";
import { logger } from "../../config/logger";
import { User } from "better-auth/*";

export const userResponseController = new Elysia({ prefix: "/user-response" })
  .decorate("user", null as unknown as User)
  .post("/submit", async ({ body, set }) => {
    try {
      const data = body as any;
      
      // Validar dados obrigatórios
      if (!data.simuladoId || !data.userId || !data.answers || !Array.isArray(data.answers)) {
        set.status = 400;
        return { error: "Dados inválidos" };
      }

      if (typeof data.timeElapsed !== 'number' || data.timeElapsed < 0) {
        set.status = 400;
        return { error: "Tempo inválido" };
      }

      const result = await UserResponseService.submitSimulado(data);
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      logger.error(`Error submitting simulado: ${error}`);
      set.status = 500;
      return { 
        error: error instanceof Error ? error.message : "Erro interno do servidor" 
      };
    }
  })
  .get("/:simuladoId", async ({ params, headers, set, user }) => {
    try {
      const { simuladoId } = params;

      const responses = await UserResponseService.getUserResponses(user.id, simuladoId);
      
      return {
        success: true,
        data: responses
      };
    } catch (error) {
      logger.error(`Error getting user responses: ${error}`);
      set.status = 500;
      return { 
        error: error instanceof Error ? error.message : "Erro interno do servidor" 
      };
    }
  }, {
    //@ts-ignore
    auth: true,
  });
