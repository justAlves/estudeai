import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { BrainCircuit, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/termos')({
  component: TermosPage,
})

function TermosPage() {
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
              EstudeAI
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
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Termos de{' '}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Uso
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Última atualização: 09 de outubro de 2025
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar e usar o EstudeAI, você concorda em cumprir e estar vinculado aos seguintes 
                termos e condições de uso. Se você não concordar com qualquer parte destes termos, 
                não deverá usar nossos serviços.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                O EstudeAI é uma plataforma de estudos com inteligência artificial que oferece:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Geração de simulados personalizados para concursos públicos</li>
                <li>Explicações detalhadas de questões por IA</li>
                <li>Correção automática de redações com feedback inteligente</li>
                <li>Acompanhamento de desempenho e estatísticas de estudo</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. Cadastro e Conta de Usuário</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para acessar determinados recursos da plataforma, você precisará criar uma conta. 
                Você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Fornecer informações verdadeiras, precisas e completas durante o cadastro</li>
                <li>Manter a segurança da sua senha e conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado da sua conta</li>
                <li>Ser responsável por todas as atividades realizadas em sua conta</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Planos e Pagamentos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Oferecemos planos gratuitos e premium. Os planos premium são cobrados mensalmente 
                e renovados automaticamente até o cancelamento. Você pode cancelar sua assinatura 
                a qualquer momento através das configurações da conta.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Não oferecemos reembolsos para períodos parciais de assinatura, exceto quando 
                exigido por lei.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Uso Aceitável</h2>
              <p className="text-muted-foreground leading-relaxed">
                Você concorda em NÃO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Usar o serviço para qualquer finalidade ilegal ou não autorizada</li>
                <li>Tentar acessar áreas não autorizadas da plataforma</li>
                <li>Compartilhar sua conta com terceiros</li>
                <li>Fazer engenharia reversa ou tentar extrair o código-fonte do serviço</li>
                <li>Reproduzir, duplicar ou copiar qualquer parte do serviço sem permissão</li>
                <li>Usar bots, scripts ou ferramentas automatizadas para acessar o serviço</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Propriedade Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                Todo o conteúdo da plataforma, incluindo mas não limitado a textos, gráficos, 
                logotipos, ícones, imagens, áudios, vídeos e software, é propriedade do EstudeAI 
                ou de seus fornecedores de conteúdo e está protegido por leis de propriedade 
                intelectual.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                As questões geradas pela IA e os feedbacks fornecidos são para uso pessoal e 
                educacional. Não é permitida a redistribuição comercial deste conteúdo.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                O EstudeAI é fornecido "como está" e não garantimos que o serviço será 
                ininterrupto, livre de erros ou completamente seguro. As explicações e correções 
                fornecidas pela IA são geradas automaticamente e devem ser usadas como material 
                de apoio aos estudos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Não nos responsabilizamos por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Resultados em provas ou concursos</li>
                <li>Precisão absoluta das informações geradas pela IA</li>
                <li>Perda de dados devido a falhas técnicas</li>
                <li>Danos indiretos ou consequenciais do uso do serviço</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Modificações dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamos o direito de modificar estes termos a qualquer momento. Alterações 
                significativas serão notificadas por e-mail ou através da plataforma. O uso 
                continuado do serviço após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Cancelamento e Suspensão</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, se 
                você violar estes termos ou se envolver em atividades fraudulentas ou prejudiciais.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Você pode cancelar sua conta a qualquer momento através das configurações ou 
                entrando em contato conosco.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Lei Aplicável</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estes termos são regidos pelas leis da República Federativa do Brasil. 
                Qualquer disputa relacionada a estes termos será resolvida nos tribunais 
                competentes do Brasil.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através 
                da página de contato ou pelo e-mail: suporte@estudeai.com.br
              </p>
            </section>
          </div>

          <div className="mt-16 p-8 rounded-2xl border border-border/50 bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              Ao usar o EstudeAI, você reconhece que leu, entendeu e concorda em estar vinculado 
              a estes Termos de Uso.
            </p>
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
              <span className="text-muted-foreground">© 2025 EstudeAI. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-8">
              <Link to="/termos" className="text-green-500">Termos</Link>
              <Link to="/privacidade" className="text-muted-foreground hover:text-green-500 transition-colors">Privacidade</Link>
              <Link to="/contato" className="text-muted-foreground hover:text-green-500 transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
