import { User } from "better-auth/*";
import Elysia, { status, t } from "elysia";
import { UserService } from "./service";

export const userController = new Elysia({ name: "user"})
  .decorate("user", null as unknown as User)
  .get("/me", ({ user }) => {
    return user
  }, {
    auth: true
  })
  .put("/me", async ({ user, body, set }) => {
    try {
      const updateData: { name?: string; email?: string; image?: string } = {}
      
      if (body.name !== undefined) updateData.name = body.name
      if (body.email !== undefined) updateData.email = body.email
      if (body.image !== undefined) updateData.image = body.image

      const updatedUser = await UserService.updateUser(user.id, updateData)
      
      return {
        success: true,
        user: updatedUser
      }
    } catch (error) {
      set.status = 500
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erro ao atualizar usuário"
      }
    }
  }, {
    auth: true,
    body: t.Object({
      name: t.Optional(t.String()),
      email: t.Optional(t.String()),
      image: t.Optional(t.String()),
    })
  })
  .get("user/:email", async ({ params: { email } }) => {
    const user = await UserService.getByEmail(email)

    if(user.length === 0) {
      return status(404, { message: "User not found" })
    }

    return user[0]
  })