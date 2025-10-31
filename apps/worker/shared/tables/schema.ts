import { account, accountRelations } from "./account.table";
import { invitation, invitationRelations } from "./invitation.table";
import { member, memberRelations } from "./member.table";
import { organization, organizationRelations } from "./organization.table";
import { session, sessionRelations } from "./session.table";
import { user, userRelations } from "./user.table";
import { verification } from "./verification.table";
import { redacao, redacaoRelations } from "./redacao.table";
import { redacaoCorrection, redacaoCorrectionRelations } from "./redacaoCorrection.table";

export const schema = {
  user,
  account,
  invitation,
  member,
  verification,
  session,
  organization,
  redacao,
  redacaoCorrection,
  accountRelations,
  invitationRelations,
  memberRelations,
  organizationRelations,
  sessionRelations,
  userRelations,
  redacaoRelations,
  redacaoCorrectionRelations,
}