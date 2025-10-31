import Stripe from "stripe";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import {
  SubscriptionRepository,
  UsageTrackingRepository,
} from "../../shared/repository/subscription.repository";
import { Effect, pipe } from "effect";
import { User } from "better-auth/*";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

export abstract class SubscriptionService {
  /**
   * Verifica se o usuário tem plano PRO ativo
   * Considera válido se a subscription está ativa E não vencida E não cancelada
   * OU se está cancelada mas ainda está dentro do período válido
   */
  static async isPro(userId: string): Promise<boolean> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const subscription = await SubscriptionRepository.findByUserId(userId);
          if (!subscription) return false;

          const now = new Date();
          const isWithinPeriod = subscription.currentPeriodEnd > now;
          
          // Se está dentro do período válido
          if (isWithinPeriod) {
            // Se está ativa e não cancelada, é PRO
            if (subscription.status === "active" && !subscription.cancelAtPeriodEnd) {
              return true;
            }
            // Se está cancelada mas ainda dentro do período válido, também é PRO
            if (subscription.cancelAtPeriodEnd || subscription.status === "canceled") {
              return true;
            }
          }
          
          return false;
        },
        catch: (error) => {
          logger.error(error);
          return false;
        },
      }),
      Effect.map((isPro) => isPro),
      Effect.runPromise,
    );
  }

  /**
   * Verifica se o usuário pode criar um simulado
   */
  static async canCreateSimulado(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const isPro = await this.isPro(userId);
          if (isPro) {
            return { allowed: true };
          }

          const count = await UsageTrackingRepository.getUsageCount(
            userId,
            "simulado",
          );
          if (count >= 1) {
            return {
              allowed: false,
              reason: "Limite semanal de simulados atingido. Upgrade para PRO para criar simulados ilimitados.",
            };
          }

          return { allowed: true };
        },
        catch: (error) => {
          logger.error(error);
          return {
            allowed: false,
            reason: "Erro ao verificar limites",
          };
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  }

  /**
   * Verifica se o usuário pode enviar redação para correção
   */
  static async canSendRedacao(userId: string): Promise<{
    allowed: boolean;
    reason?: string;
  }> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const isPro = await this.isPro(userId);
          if (isPro) {
            return { allowed: true };
          }

          const count = await UsageTrackingRepository.getUsageCount(
            userId,
            "redacao",
          );
          if (count >= 1) {
            return {
              allowed: false,
              reason: "Limite semanal de correções de redação atingido. Upgrade para PRO para correções ilimitadas.",
            };
          }

          return { allowed: true };
        },
        catch: (error) => {
          logger.error(error);
          return {
            allowed: false,
            reason: "Erro ao verificar limites",
          };
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  }

  /**
   * Incrementa o uso de simulado
   */
  static async incrementSimuladoUsage(userId: string): Promise<void> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const isPro = await this.isPro(userId);
          if (!isPro) {
            await UsageTrackingRepository.incrementUsage(userId, "simulado");
          }
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.runPromise,
    );
  }

  /**
   * Incrementa o uso de redação
   */
  static async incrementRedacaoUsage(userId: string): Promise<void> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const isPro = await this.isPro(userId);
          if (!isPro) {
            await UsageTrackingRepository.incrementUsage(userId, "redacao");
          }
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.runPromise,
    );
  }

  /**
   * Cria sessão de checkout do Stripe
   */
  static async createCheckoutSession(
    userId: string,
    userEmail: string,
  ): Promise<{ url: string }> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          // Verificar se já existe uma subscription válida (não vencida)
          const existingSubscription = await SubscriptionRepository.findByUserId(userId);
          
          if (existingSubscription) {
            const now = new Date();
            const periodEnd = existingSubscription.currentPeriodEnd;
            
            // Se a subscription ainda está válida (não vencida)
            if (periodEnd > now) {
              // Se está cancelada mas ainda válida, apenas remover o cancelamento
              if (existingSubscription.cancelAtPeriodEnd || existingSubscription.status === "canceled") {
                logger.info(`Subscription for user ${userId} is still valid until ${periodEnd}, removing cancellation instead of creating new checkout`);
                
                // Remover cancelamento no Stripe se tiver subscriptionId
                if (existingSubscription.stripeSubscriptionId) {
                  try {
                    await stripe.subscriptions.update(existingSubscription.stripeSubscriptionId, {
                      cancel_at_period_end: false,
                    });
                  } catch (error) {
                    logger.error(`Error removing cancellation from Stripe: ${error}`);
                  }
                }
                
                // Atualizar no banco
                await SubscriptionRepository.updateByUserId(userId, {
                  cancelAtPeriodEnd: false,
                  status: "active",
                });
                
                // Retornar URL de sucesso em vez de criar novo checkout
                return { url: `${env.FRONTEND_URL}/configuracoes?restored=true` };
              }
              
              // Se já está ativa e não cancelada, não precisa fazer nada
              if (existingSubscription.status === "active" && !existingSubscription.cancelAtPeriodEnd) {
                logger.info(`User ${userId} already has an active subscription`);
                return { url: `${env.FRONTEND_URL}/configuracoes?already_active=true` };
              }
            }
          }
          
          // Buscar ou criar customer no Stripe
          let customerId: string;
          if (existingSubscription?.stripeCustomerId) {
            customerId = existingSubscription.stripeCustomerId;
          } else {
            const customer = await stripe.customers.create({
              email: userEmail,
              metadata: {
                userId,
              },
            });
            customerId = customer.id;
          }

          const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            line_items: [
              {
                price: env.STRIPE_PRICE_ID,
                quantity: 1,
              },
            ],
            mode: "subscription",
            success_url: `${env.FRONTEND_URL}/configuracoes?success=true`,
            cancel_url: `${env.FRONTEND_URL}/configuracoes?canceled=true`,
            metadata: {
              userId,
            },
            subscription_data: {
              metadata: {
                userId,
              },
            },
          });

          return { url: session.url || "" };
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  }

  /**
   * Cria portal de gerenciamento do cliente
   */
  static async createPortalSession(
    customerId: string,
  ): Promise<{ url: string }> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${env.FRONTEND_URL}/configuracoes`,
          });

          return { url: session.url };
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  }

  /**
   * Cancela assinatura (mantém ativa até o fim do período)
   */
  static async cancelSubscription(userId: string): Promise<void> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const subscription = await SubscriptionRepository.findByUserId(userId);
          if (!subscription?.stripeSubscriptionId) {
            throw new Error("Assinatura não encontrada");
          }

          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true,
          });

          await SubscriptionRepository.cancelAtPeriodEnd(userId);
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.runPromise,
    );
  }

  /**
   * Processa webhook do Stripe
   */
  static async handleWebhook(
    event: Stripe.Event,
  ): Promise<{ success: boolean }> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          switch (event.type) {
            case "checkout.session.completed": {
              const session = event.data.object as Stripe.Checkout.Session;
              const customerId = session.customer as string;
              const subscriptionId = session.subscription as string;
              const userId = session.metadata?.userId;

              if (!userId || !subscriptionId) {
                logger.error("Missing userId or subscriptionId in checkout session");
                break;
              }

              // Verificar se já existe subscription para evitar duplicatas
              // Verifica tanto por userId quanto por customerId
              // IMPORTANTE: Se já existe (mesmo cancelada), restaurar em vez de criar nova
              const existingByUser = await SubscriptionRepository.findByUserId(userId);
              const existingByCustomer = await SubscriptionRepository.findByStripeCustomerId(customerId);
              
              if (existingByUser || existingByCustomer) {
                const existing = existingByUser || existingByCustomer;
                
                if (!existing) {
                  logger.error(`Found existing subscription but could not retrieve it`);
                  break;
                }
                
                logger.info(`Restoring subscription for user ${userId} (was ${existing.status}), updating with new subscription ${subscriptionId}`);
                
                // Buscar subscription do Stripe para obter dados atualizados
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const priceId = subscription.items.data[0]?.price.id;
                
                // Tentar obter as datas
                let periodStart = (subscription as any).current_period_start;
                let periodEnd = (subscription as any).current_period_end;
                
                if (!periodStart || !periodEnd) {
                  for (let attempt = 0; attempt < 3; attempt++) {
                    try {
                      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
                      const fullSubscription = await stripe.subscriptions.retrieve(subscriptionId);
                      periodStart = (fullSubscription as any).current_period_start;
                      periodEnd = (fullSubscription as any).current_period_end;
                      if (periodStart && periodEnd) break;
                    } catch (error) {
                      logger.error(`Error retrieving subscription (attempt ${attempt + 1}): ${error}`);
                    }
                  }
                }
                
                // Fallback para datas caso não encontre
                if (!periodStart || !periodEnd) {
                  logger.warn(`Subscription ${subscriptionId} missing period dates, using fallback dates`);
                  const now = Math.floor(Date.now() / 1000);
                  periodStart = periodStart || now;
                  periodEnd = periodEnd || (now + (30 * 24 * 60 * 60));
                }
                
                const updateData: {
                  stripeSubscriptionId: string;
                  stripePriceId?: string;
                  status: string;
                  currentPeriodStart?: Date;
                  currentPeriodEnd?: Date;
                  cancelAtPeriodEnd: boolean;
                } = {
                  stripeSubscriptionId: subscriptionId,
                  status: subscription.status,
                  cancelAtPeriodEnd: false, // Remover cancelamento ao restaurar
                };
                
                if (priceId) {
                  updateData.stripePriceId = priceId;
                }
                
                if (periodStart) {
                  updateData.currentPeriodStart = new Date(periodStart * 1000);
                }
                if (periodEnd) {
                  updateData.currentPeriodEnd = new Date(periodEnd * 1000);
                }
                
                await SubscriptionRepository.updateByUserId(existing.userId, updateData);
                logger.info(`Subscription restored and updated for user ${userId}`);
                break;
              }

              const subscription = await stripe.subscriptions.retrieve(
                subscriptionId,
              );
              const priceId = subscription.items.data[0]?.price.id;

              if (!priceId) {
                logger.error("Price ID not found in subscription");
                break;
              }

              // Tentar obter as datas - podem não estar presentes imediatamente
              let periodStart = (subscription as any).current_period_start;
              let periodEnd = (subscription as any).current_period_end;
              
              // Se as datas não estiverem presentes, buscar a subscription completa do Stripe
              // Tenta até 3 vezes com delay entre tentativas
              if (!periodStart || !periodEnd) {
                for (let attempt = 0; attempt < 3; attempt++) {
                  try {
                    await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1))); // Delay incremental
                    const fullSubscription = await stripe.subscriptions.retrieve(subscriptionId);
                    periodStart = (fullSubscription as any).current_period_start;
                    periodEnd = (fullSubscription as any).current_period_end;
                    
                    if (periodStart && periodEnd) {
                      break; // Datas encontradas, sair do loop
                    }
                  } catch (error) {
                    logger.error(`Error retrieving full subscription ${subscriptionId} (attempt ${attempt + 1}): ${error}`);
                  }
                }
              }
              
              // Se ainda não tiver as datas, usar fallback baseado na data atual
              // Assumindo um período mensal padrão (30 dias)
              if (!periodStart || !periodEnd) {
                logger.warn(`Subscription ${subscriptionId} missing period dates, using fallback dates`);
                const now = Math.floor(Date.now() / 1000);
                periodStart = now;
                periodEnd = now + (30 * 24 * 60 * 60); // 30 dias a partir de agora
              }

              await SubscriptionRepository.create({
                userId,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: priceId,
                status: subscription.status,
                currentPeriodStart: new Date(periodStart * 1000),
                currentPeriodEnd: new Date(periodEnd * 1000),
              });

              logger.info(`Subscription created for user ${userId}`);
              break;
            }

            case "customer.subscription.created": {
              const subscription = event.data.object as Stripe.Subscription;
              const customerId = subscription.customer as string;
              const subscriptionId = subscription.id;
              
              // Tentar obter userId de várias fontes
              let userId = subscription.metadata?.userId;
              
              // Se não tiver no metadata da subscription, buscar do customer
              if (!userId) {
                try {
                  const customer = await stripe.customers.retrieve(customerId);
                  if (customer && !customer.deleted) {
                    userId = (customer as Stripe.Customer).metadata?.userId;
                  }
                } catch (error) {
                  logger.error(`Error retrieving customer ${customerId}: ${error}`);
                }
              }

              // Se ainda não tiver userId, tentar buscar subscription existente pelo customerId
              if (!userId) {
                const existing = await SubscriptionRepository.findByStripeCustomerId(customerId);
                if (existing) {
                  logger.info(`Subscription already exists for customer ${customerId}, skipping`);
                  break;
                }
                logger.error(`Missing userId in subscription metadata and customer metadata for customer ${customerId}`);
                break;
              }

              // Verificar se já existe subscription para evitar duplicatas
              // Verifica tanto por userId quanto por customerId
              // IMPORTANTE: Se já existe (mesmo cancelada), restaurar em vez de criar nova
              const existingByUser = await SubscriptionRepository.findByUserId(userId);
              const existingByCustomer = await SubscriptionRepository.findByStripeCustomerId(customerId);
              
              if (existingByUser || existingByCustomer) {
                const existing = existingByUser || existingByCustomer;
                
                if (!existing) {
                  logger.error(`Found existing subscription but could not retrieve it`);
                  break;
                }
                
                logger.info(`Restoring subscription for user ${userId} (was ${existing.status}), updating with new subscription ${subscriptionId}`);
                
                // Tentar obter as datas - podem não estar presentes imediatamente
                let periodStart = (subscription as any).current_period_start;
                let periodEnd = (subscription as any).current_period_end;
                const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end;
                
                // Se as datas não estiverem presentes, buscar a subscription completa do Stripe
                if (!periodStart || !periodEnd) {
                  try {
                    const fullSubscription = await stripe.subscriptions.retrieve(subscriptionId);
                    periodStart = (fullSubscription as any).current_period_start;
                    periodEnd = (fullSubscription as any).current_period_end;
                  } catch (error) {
                    logger.error(`Error retrieving full subscription ${subscriptionId}: ${error}`);
                  }
                }
                
                // Fallback para datas caso não encontre
                if (!periodStart || !periodEnd) {
                  logger.warn(`Subscription ${subscriptionId} missing period dates, using fallback dates`);
                  const now = Math.floor(Date.now() / 1000);
                  periodStart = periodStart || now;
                  periodEnd = periodEnd || (now + (30 * 24 * 60 * 60));
                }

                const updateData: {
                  stripeSubscriptionId: string;
                  status: string;
                  currentPeriodStart?: Date;
                  currentPeriodEnd?: Date;
                  cancelAtPeriodEnd: boolean;
                } = {
                  stripeSubscriptionId: subscriptionId,
                  status: subscription.status,
                  cancelAtPeriodEnd: false, // Remover cancelamento ao restaurar
                };

                if (periodStart) {
                  updateData.currentPeriodStart = new Date(periodStart * 1000);
                }
                if (periodEnd) {
                  updateData.currentPeriodEnd = new Date(periodEnd * 1000);
                }

                await SubscriptionRepository.updateByUserId(existing.userId, updateData);
                logger.info(`Subscription restored and updated for user ${userId} from customer.subscription.created`);
                break;
              }
              
              // Tentar obter as datas - podem não estar presentes imediatamente
              let periodStart = (subscription as any).current_period_start;
              let periodEnd = (subscription as any).current_period_end;
              const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end;
              
              // Se as datas não estiverem presentes, buscar a subscription completa do Stripe
              // Tenta até 3 vezes com delay entre tentativas
              if (!periodStart || !periodEnd) {
                for (let attempt = 0; attempt < 3; attempt++) {
                  try {
                    await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1))); // Delay incremental
                    const fullSubscription = await stripe.subscriptions.retrieve(subscriptionId);
                    periodStart = (fullSubscription as any).current_period_start;
                    periodEnd = (fullSubscription as any).current_period_end;
                    
                    if (periodStart && periodEnd) {
                      break; // Datas encontradas, sair do loop
                    }
                  } catch (error) {
                    logger.error(`Error retrieving full subscription ${subscriptionId} (attempt ${attempt + 1}): ${error}`);
                  }
                }
              }

              // Se ainda não tiver as datas, usar fallback baseado na data atual
              if (!periodStart || !periodEnd) {
                logger.warn(`Subscription ${subscriptionId} missing period dates, using fallback dates`);
                const now = Math.floor(Date.now() / 1000);
                periodStart = periodStart || now;
                periodEnd = periodEnd || (now + (30 * 24 * 60 * 60)); // 30 dias a partir de agora
              }

              const priceId = subscription.items.data[0]?.price.id;

              if (!priceId) {
                logger.error("Price ID not found in subscription");
                break;
              }

              await SubscriptionRepository.create({
                userId,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                stripePriceId: priceId,
                status: subscription.status,
                currentPeriodStart: new Date(periodStart * 1000),
                currentPeriodEnd: new Date(periodEnd * 1000),
              });

              logger.info(`Subscription created for user ${userId} from customer.subscription.created`);
              break;
            }

            case "customer.subscription.updated": {
              const subscription = event.data.object as Stripe.Subscription;
              const customerId = subscription.customer as string;

              const existingSubscription =
                await SubscriptionRepository.findByStripeCustomerId(customerId);

              if (!existingSubscription) {
                logger.error("Subscription not found for update");
                break;
              }

              // Validar que as datas existem antes de atualizar
              const periodStart = (subscription as any).current_period_start;
              const periodEnd = (subscription as any).current_period_end;
              const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end;

              const updateData: {
                status: string;
                currentPeriodStart?: Date;
                currentPeriodEnd?: Date;
                cancelAtPeriodEnd: boolean;
              } = {
                status: subscription.status,
                cancelAtPeriodEnd: cancelAtPeriodEnd || false,
              };

              if (periodStart) {
                updateData.currentPeriodStart = new Date(periodStart * 1000);
              }

              if (periodEnd) {
                updateData.currentPeriodEnd = new Date(periodEnd * 1000);
              }

              await SubscriptionRepository.updateByUserId(
                existingSubscription.userId,
                updateData,
              );

              logger.info(`Subscription updated for user ${existingSubscription.userId}`);
              break;
            }

            case "customer.subscription.deleted": {
              const subscription = event.data.object as Stripe.Subscription;
              const customerId = subscription.customer as string;

              const existingSubscription =
                await SubscriptionRepository.findByStripeCustomerId(customerId);

              if (!existingSubscription) {
                logger.error("Subscription not found for deletion");
                break;
              }

              await SubscriptionRepository.updateByUserId(
                existingSubscription.userId,
                {
                  status: "canceled",
                },
              );

              logger.info(`Subscription deleted for user ${existingSubscription.userId}`);
              break;
            }

            case "invoice.payment_succeeded":
            case "invoice.paid": {
              const invoice = event.data.object as Stripe.Invoice;
              const subscriptionId = (invoice as any).subscription as string;

              if (!subscriptionId) break;

              const subscription = await stripe.subscriptions.retrieve(
                subscriptionId,
              );
              
              const customerId = subscription.customer as string;
              const existingSubscription =
                await SubscriptionRepository.findByStripeCustomerId(customerId);

              if (existingSubscription) {
                const periodStart = (subscription as any).current_period_start;
                const periodEnd = (subscription as any).current_period_end;

                const updateData: {
                  status: string;
                  currentPeriodStart?: Date;
                  currentPeriodEnd?: Date;
                } = {
                  status: "active",
                };

                if (periodStart) {
                  updateData.currentPeriodStart = new Date(periodStart * 1000);
                }

                if (periodEnd) {
                  updateData.currentPeriodEnd = new Date(periodEnd * 1000);
                }

                await SubscriptionRepository.updateByUserId(
                  existingSubscription.userId,
                  updateData,
                );
              }

              logger.info(`Payment succeeded for subscription ${subscriptionId}`);
              break;
            }

            case "invoice.payment_failed": {
              const invoice = event.data.object as Stripe.Invoice;
              const subscriptionId = (invoice as any).subscription as string;

              if (!subscriptionId) break;

              const subscription = await stripe.subscriptions.retrieve(
                subscriptionId,
              );
              
              const customerId = subscription.customer as string;
              const existingSubscription =
                await SubscriptionRepository.findByStripeCustomerId(customerId);

              if (existingSubscription) {
                await SubscriptionRepository.updateByUserId(
                  existingSubscription.userId,
                  {
                    status: "past_due",
                  },
                );
              }

              logger.info(`Payment failed for subscription ${subscriptionId}`);
              break;
            }

            default:
              logger.info(`Unhandled event type: ${event.type}`);
          }

          return { success: true };
        },
        catch: (error) => {
          logger.error(`Error handling webhook: ${error}`);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  }

  /**
   * Obtém status da assinatura do usuário
   */
  static async getSubscriptionStatus(userId: string): Promise<{
    isPro: boolean;
    subscription?: {
      status: string;
      currentPeriodEnd: Date;
      cancelAtPeriodEnd: boolean;
    };
    usage?: {
      simulados: number;
      redacoes: number;
    };
  }> {
    return pipe(
      Effect.tryPromise({
        try: async () => {
          const subscription = await SubscriptionRepository.findByUserId(userId);
          const isPro = await this.isPro(userId);

          const usage = {
            simulados: await UsageTrackingRepository.getUsageCount(
              userId,
              "simulado",
            ),
            redacoes: await UsageTrackingRepository.getUsageCount(
              userId,
              "redacao",
            ),
          };

          if (!subscription) {
            return {
              isPro: false,
              usage,
            };
          }

          return {
            isPro,
            subscription: {
              status: subscription.status,
              currentPeriodEnd: subscription.currentPeriodEnd,
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            },
            usage,
          };
        },
        catch: (error) => {
          logger.error(error);
          throw new Error(error instanceof Error ? error.message : String(error));
        },
      }),
      Effect.map((result) => result),
      Effect.runPromise,
    );
  }
}

