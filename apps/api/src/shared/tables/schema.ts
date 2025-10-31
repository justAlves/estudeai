import { account, accountRelations } from "./account.table";
import { invitation, invitationRelations } from "./invitation.table";
import { member, memberRelations } from "./member.table";
import { organization, organizationRelations } from "./organization.table";
import { session, sessionRelations } from "./session.table";
import { user, userRelations } from "./user.table";
import { verification } from "./verification.table";
import { simulado, simuladoRelations } from "./simulado.table";
import { question, questionRelations, option, optionRelations } from "./question.table";
import { userResponse, userResponseRelations } from "./userResponse.table";
import { redacao, redacaoRelations } from "./redacao.table";
import { redacaoCorrection, redacaoCorrectionRelations } from "./redacaoCorrection.table";
import { subscription, subscriptionRelations } from "./subscription.table";
import { usageTracking, usageTrackingRelations } from "./usageTracking.table";

export const schema = {
  user,
  account,
  invitation,
  member,
  verification,
  session,
  organization,
  simulado,
  question,
  option,
  userResponse,
  redacao,
  redacaoCorrection,
  subscription,
  usageTracking,
  accountRelations,
  invitationRelations,
  memberRelations,
  organizationRelations,
  sessionRelations,
  userRelations,
  simuladoRelations,
  questionRelations,
  optionRelations,
  userResponseRelations,
  redacaoRelations,
  redacaoCorrectionRelations,
  subscriptionRelations,
  usageTrackingRelations,
}