import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { BrainCircuit, ArrowLeft, Shield } from 'lucide-react'

export const Route = createFileRoute('/privacidade')({
  component: PrivacidadePage,
})

function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50 bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full"></div>
              <BrainCircuit className="size-8 text-green-500 relative" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Estudy AI
            </span>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="size-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-16 relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 backdrop-blur-sm">
              <Shield className="size-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Sua privacidade é nossa prioridade</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Política de{' '}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Privacidade
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Última atualização: 09 de outubro de 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Introdução</h2>
              <p className="text-muted-foreground leading-relaxed">
                A Estudy AI ("nós", "nosso" ou "nossa") está comprometida em proteger sua privacidade. 
                Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos 
                suas informações quando você usa nossa plataforma de estudos com inteligência artificial.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Ao usar o Estudy AI, você concorda com a coleta e uso de informações de acordo com 
                esta política.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Informações que Coletamos</h2>
              
              <h3 className="text-xl font-semibold mt-6">2.1 Informações Fornecidas por Você</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Dados de Cadastro:</strong> Nome, e-mail, senha (criptografada)</li>
                <li><strong>Informações de Perfil:</strong> Foto de perfil, preferências de estudo, concurso de interesse</li>
                <li><strong>Informações de Pagamento:</strong> Dados de cobrança processados por terceiros seguros</li>
                <li><strong>Conteúdo Gerado:</strong> Respostas de simulados, redações enviadas, histórico de questões</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6">2.2 Informações Coletadas Automaticamente</h3>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Dados de Uso:</strong> Páginas visitadas, tempo de uso, recursos utilizados</li>
                <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de navegador, sistema operacional, dispositivo</li>
                <li><strong>Cookies:</strong> Pequenos arquivos armazenados no seu dispositivo para melhorar a experiência</li>
                <li><strong>Dados de Desempenho:</strong> Estatísticas de acertos, tempo de resposta, progresso nos estudos</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Como Usamos Suas Informações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos suas informações para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Fornecer, operar e manter nossos serviços</li>
                <li>Personalizar sua experiência de estudo com IA</li>
                <li>Gerar simulados adaptados ao seu nível e área de interesse</li>
                <li>Processar pagamentos e gerenciar assinaturas</li>
                <li>Enviar notificações sobre atualizações, novos recursos e conteúdos</li>
                <li>Analisar o uso da plataforma para melhorias contínuas</li>
                <li>Detectar, prevenir e resolver problemas técnicos</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Inteligência Artificial e Privacidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nossa plataforma utiliza IA para gerar simulados, explicar questões e corrigir redações. 
                É importante você saber que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Suas redações e respostas podem ser processadas por modelos de IA para fornecer feedback personalizado</li>
                <li>Os dados são usados de forma agregada e anonimizada para treinar e melhorar nossos modelos</li>
                <li>Não compartilhamos seus dados pessoais identificáveis com os provedores de IA sem seu consentimento</li>
                <li>Você pode solicitar a exclusão dos seus dados de treinamento a qualquer momento</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Compartilhamento de Informações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas 
                seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Provedores de Serviços:</strong> Empresas que nos auxiliam (hospedagem, pagamentos, analytics)</li>
                <li><strong>Conformidade Legal:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
                <li><strong>Transferência de Negócio:</strong> Em caso de fusão, aquisição ou venda de ativos</li>
                <li><strong>Com Seu Consentimento:</strong> Quando você autorizar explicitamente</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Segurança dos Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Senhas armazenadas com hash seguro (bcrypt)</li>
                <li>Acesso restrito aos dados apenas para pessoal autorizado</li>
                <li>Monitoramento contínuo de segurança e vulnerabilidades</li>
                <li>Backups regulares e planos de recuperação de desastres</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                No entanto, nenhum método de transmissão pela internet é 100% seguro. Não podemos 
                garantir segurança absoluta.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Seus Direitos (LGPD)</h2>
              <p className="text-muted-foreground leading-relaxed">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Acesso:</strong> Confirmar se processamos seus dados e solicitar uma cópia</li>
                <li><strong>Correção:</strong> Atualizar dados incompletos, inexatos ou desatualizados</li>
                <li><strong>Exclusão:</strong> Solicitar a exclusão de dados pessoais, exceto quando houver obrigação legal</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado e legível</li>
                <li><strong>Revogação:</strong> Retirar consentimento para processamento de dados</li>
                <li><strong>Oposição:</strong> Opor-se a determinados tipos de processamento</li>
                <li><strong>Revisão:</strong> Solicitar revisão de decisões automatizadas</li>
              </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                Para exercer seus direitos, entre em contato através do e-mail: privacidade@estudy.ai
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Cookies e Tecnologias Similares</h2>
              <p className="text-muted-foreground leading-relaxed">
                Usamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li><strong>Cookies Essenciais:</strong> Necessários para o funcionamento da plataforma</li>
                <li><strong>Cookies de Desempenho:</strong> Para análise e melhoria da experiência</li>
                <li><strong>Cookies de Funcionalidade:</strong> Para lembrar suas preferências</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Você pode gerenciar cookies através das configurações do seu navegador, mas isso pode 
                afetar algumas funcionalidades.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos seus dados pessoais apenas pelo tempo necessário para os fins descritos nesta 
                política, exceto quando um período de retenção maior for exigido ou permitido por lei.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Após o cancelamento da conta, seus dados serão excluídos ou anonimizados em até 90 dias, 
                exceto informações necessárias para cumprimento de obrigações legais.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Crianças e Adolescentes</h2>
              <p className="text-muted-foreground leading-relaxed">
                Nosso serviço é destinado a maiores de 16 anos. Se você tem entre 16 e 18 anos, 
                deve ter autorização dos pais ou responsáveis para usar a plataforma. Não coletamos 
                intencionalmente dados de menores de 16 anos sem consentimento parental.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Alterações nesta Política</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você 
                sobre alterações significativas por e-mail ou através de um aviso destacado na plataforma. 
                Recomendamos que você revise esta política regularmente.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">12. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados, 
                entre em contato conosco:
              </p>
              <div className="bg-muted/30 p-6 rounded-lg space-y-2 mt-4">
                <p className="text-muted-foreground"><strong>E-mail:</strong> privacidade@estudy.ai</p>
                <p className="text-muted-foreground"><strong>Encarregado de Dados (DPO):</strong> dpo@estudy.ai</p>
              </div>
            </section>
          </div>

          <div className="mt-16 p-8 rounded-2xl border border-green-500/20 bg-green-500/5">
            <div className="flex items-start gap-4">
              <Shield className="size-8 text-green-500 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Compromisso com sua Privacidade</h3>
                <p className="text-sm text-muted-foreground">
                  Estamos comprometidos em proteger suas informações pessoais e em ser transparentes 
                  sobre como usamos seus dados. Sua confiança é fundamental para nós.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 relative mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-md rounded-full"></div>
                <BrainCircuit className="size-6 text-green-500 relative" />
              </div>
              <span className="text-muted-foreground">© 2025 Estudy AI. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-8">
              <Link to="/termos" className="text-muted-foreground hover:text-green-500 transition-colors">Termos</Link>
              <Link to="/privacidade" className="text-green-500">Privacidade</Link>
              <Link to="/contato" className="text-muted-foreground hover:text-green-500 transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
