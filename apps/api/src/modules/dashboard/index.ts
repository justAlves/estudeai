import { Elysia } from "elysia";
import { DashboardService } from "./service";
import { logger } from "../../config/logger";
import { User } from "better-auth/*";
import { Effect, pipe } from "effect";

export const dashboardController = new Elysia({ prefix: "/dashboard" })
  .decorate("user", null as unknown as User)
  .get("/stats", async ({ user, set }) => {
    try {
      const stats = await DashboardService.getStats(user.id);
      
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      logger.error(`Error getting dashboard stats: ${error}`);
      set.status = 500;
      return {
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      };
    }
  }, {
    //@ts-ignore
    auth: true,
  });

