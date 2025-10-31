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

 static async updateUser(userId: string, data: { name?: string; email?: string; image?: string }) {
   const updateData: any = {
     updatedAt: new Date(),
   }

   if (data.name !== undefined) {
     updateData.name = data.name
   }
   if (data.email !== undefined) {
     updateData.email = data.email
   }
   if (data.image !== undefined) {
     updateData.image = data.image
   }

   const updatedUser = await drizzle
     .update(user)
     .set(updateData)
     .where(eq(user.id, userId))
     .returning()

   return updatedUser[0]
 }
}