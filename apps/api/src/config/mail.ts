import { Resend } from "resend";
import { env } from "./env";

const mail = new Resend(env.RESEND_API_KEY);

mail.apiKeys.create({ name: 'Production' });



export {
  mail
}