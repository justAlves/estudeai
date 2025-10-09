import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrainCircuit, FileCheck, MessageSquareText, Sparkles, Zap, Target, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden w-full">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Top Gradient Glow */}
      <div className="opacity-30 absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-green-500/20 via-emerald-500/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>
      
      {/* Header/Nav */}
      <header className="border-b border-border/40 backdrop-blur-xl sticky top-0 z-50 bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full"></div>
              <BrainCircuit className="size-8 text-green-500 relative" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Estudy AI
            </span>
          </div>
          <Link to="/login">
            <Button variant="outline" size="default">
              Começar agora 🚀
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 backdrop-blur-sm text-green-600 text-sm font-medium mb-4">
            <Sparkles className="size-4" />
            Seu assistente de estudos com IA
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
            Estude para concursos com{' '}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 blur-2xl opacity-10"></span>
              <span className="relative bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                inteligência artificial
              </span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Simulados personalizados, correção de redações instantânea e explicações detalhadas de cada questão. 
            Tudo isso com o poder da IA para acelerar sua aprovação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base group shadow-lg shadow-green-500/25">
                Começar gratuitamente
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-green-500"></div>
              Sem cartão de crédito
            </div>
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-green-500"></div>
              Acesso imediato
            </div>
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-green-500"></div>
              Cancele quando quiser
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-32 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Recursos poderosos para{' '}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                sua aprovação
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para estudar de forma inteligente e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card className="relative p-8 space-y-6 backdrop-blur-sm bg-background/50 border-border/50 hover:border-green-500/50 transition-all duration-300 h-full">
                <div className="relative">
                  <div className="relative size-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <Target className="size-7 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Simulados com IA</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Gere simulados personalizados baseados no edital do seu concurso. 
                    A IA seleciona questões no nível certo para você.
                  </p>
                </div>
              </Card>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card className="relative p-8 space-y-6 backdrop-blur-sm bg-background/50 border-border/50 hover:border-green-500/50 transition-all duration-300 h-full">
                <div className="relative">
                  <div className="relative size-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <MessageSquareText className="size-7 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Explicações inteligentes</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Errou uma questão? A IA explica o porquê de forma clara e didática, 
                    mostrando o raciocínio correto.
                  </p>
                </div>
              </Card>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Card className="relative p-8 space-y-6 backdrop-blur-sm bg-background/50 border-border/50 hover:border-green-500/50 transition-all duration-300 h-full">
                <div className="relative">
                  <div className="relative size-14 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <FileCheck className="size-7 text-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Correção de redações</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Receba feedback instantâneo e detalhado sobre suas redações, 
                    com sugestões de melhoria e pontuação estimada.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-32 relative">
        <div className="max-w-5xl mx-auto relative">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Escolha seu{' '}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                plano
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              Comece grátis e faça upgrade quando precisar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 space-y-8 backdrop-blur-sm bg-background/50 border-border/50 relative group hover:border-border transition-colors">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Gratuito</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="size-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-muted-foreground">Simulados pré-gerados</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="size-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-muted-foreground">3 explicações por dia</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="size-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="size-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-muted-foreground">Acesso limitado aos recursos</span>
                </li>
              </ul>

              <Link to="/register" className="block">
                <Button variant="outline" className="w-full" size="lg">
                  Começar grátis
                </Button>
              </Link>
            </Card>

            {/* Premium Plan */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-50 transition-opacity"></div>
              <Card className="relative p-8 space-y-8 backdrop-blur-sm bg-background border-2 border-green-500/50 overflow-hidden">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  POPULAR
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Premium</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">R$ 29,90</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold text-foreground">Simulados ilimitados</strong> gerados por IA</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold text-foreground">Explicações ilimitadas</strong> de questões</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                    <span><strong className="font-semibold text-foreground">Correção de redações</strong> com IA</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Simulados personalizados por edital</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Estatísticas e acompanhamento</span>
                  </li>
                </ul>

                <Link to="/register" className="block">
                  <Button className="w-full shadow-lg shadow-green-500/25" size="lg">
                    Começar agora
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 relative">
        <div className="opacity-30 absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-green-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 opacity-10"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:14px_14px]"></div>
            <div className="relative px-8 py-20 md:py-28 text-center space-y-8 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Pronto para acelerar seus estudos?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Junte-se a milhares de concurseiros que já estão estudando de forma mais inteligente
              </p>
              <Link to="/register">
                <Button size="lg" className="text-base shadow-lg shadow-green-500/25 group">
                  Criar conta gratuita
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 relative">
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
              <Link to="/privacidade" className="text-muted-foreground hover:text-green-500 transition-colors">Privacidade</Link>
              <Link to="/contato" className="text-muted-foreground hover:text-green-500 transition-colors">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
