import { User } from "better-auth/*";
import Elysia, { status } from "elysia";
import { UserService } from "./service";

export const userController = new Elysia({ name: "user"})
  .decorate("user", null as unknown as User)
  .get("/me", ({ user }) => {
    return user
  }, {
    auth: true
  })
  .get("user/:email", async ({ params: { email } }) => {
    const user = await UserService.getByEmail(email)

    if(user.length === 0) {
      return status(404, { message: "User not found" })
    }

    return user[0]
  })