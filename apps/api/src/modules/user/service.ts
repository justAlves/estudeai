import { eq } from "drizzle-orm";
import { drizzle } from "../../config/db";
import { user } from "../../shared/tables/user.table";

export abstract class UserService {
 static getByEmail(email: string) {
   const userFounded = drizzle.select().from(user).where(eq(user.email, email)).limit(1)
   
   return userFounded
 }

 static async getById(id: string) {
   const userFounded = await drizzle.select().from(user).where(eq(user.id, id)).limit(1);
   return userFounded;
 }
}