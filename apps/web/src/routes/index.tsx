import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BrainCircuit, FileCheck, MessageSquareText, Sparkles, Zap, Target, ArrowRight, Check, TrendingUp, PlayCircle, Shield, Clock, Star, ChevronDown, BarChart3, Rocket, X } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden w-full">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none"></div>
      
      {/* Subtle Top Gradient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-green-500/8 via-emerald-500/4 to-transparent blur-3xl rounded-full pointer-events-none"></div>
      
      {/* Header/Navigation */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/10 blur-md rounded-lg group-hover:bg-green-500/20 transition-colors"></div>
              <BrainCircuit className="size-7 text-green-500 relative" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Estudy AI
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Recursos</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Preços</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <Link to="/login">
            <Button variant="outline" size="default" className="font-medium">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 lg:py-40 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 text-sm font-medium">
            <Sparkles className="size-3.5" />
            <span>Plataforma de estudos com IA</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
            Estude para concursos com{' '}
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 bg-clip-text text-transparent">
              inteligência artificial
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Simulados personalizados, correção de redações instantânea e explicações detalhadas de cada questão. 
            Tudo isso com o poder da IA para acelerar sua aprovação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button size="lg" className="text-base font-medium shadow-md shadow-green-500/10 hover:shadow-green-500/20 group">
                Começar gratuitamente
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="text-base font-medium">
                Ver demonstração
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-8">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              <span>Acesso imediato</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-500" />
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16 md:py-24 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-sm md:text-base text-muted-foreground">Usuários ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                50K+
              </div>
              <div className="text-sm md:text-base text-muted-foreground">Simulados realizados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                85%
              </div>
              <div className="text-sm md:text-base text-muted-foreground">Taxa de aprovação</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                4.8/5
              </div>
              <div className="text-sm md:text-base text-muted-foreground">Avaliação média</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Como{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                funciona
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Em três passos simples, você começa a estudar de forma inteligente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative">
              <div className="absolute -left-4 top-0 hidden md:block">
                <div className="w-8 h-0.5 bg-border mt-12"></div>
              </div>
              <Card className="p-8 border border-border/50 bg-card text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Crie sua conta</h3>
                <p className="text-muted-foreground">
                  Cadastre-se gratuitamente em menos de 2 minutos. Sem necessidade de cartão de crédito.
                </p>
              </Card>
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-0 hidden md:block">
                <div className="w-8 h-0.5 bg-border mt-12"></div>
              </div>
              <Card className="p-8 border border-border/50 bg-card text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Configure seu perfil</h3>
                <p className="text-muted-foreground">
                  Informe o concurso que você vai prestar e nossa IA ajusta o conteúdo para você.
                </p>
              </Card>
            </div>
            <div className="relative">
              <Card className="p-8 border border-border/50 bg-card text-center">
                <div className="size-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Comece a estudar</h3>
                <p className="text-muted-foreground">
                  Acesse simulados, receba explicações instantâneas e melhore seu desempenho.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Preview/Demo Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium w-fit">
                <PlayCircle className="size-4" />
                <span>Demonstração</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Veja a{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  plataforma
                </span>{' '}
                em ação
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nossa interface intuitiva foi projetada para tornar seus estudos mais eficientes. 
                Veja como é fácil navegar e aproveitar todos os recursos disponíveis.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Interface limpa e intuitiva</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Design responsivo para todos os dispositivos</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Acesso rápido aos seus recursos</span>
                </li>
              </ul>
              <Link to="/register">
                <Button size="lg" className="font-medium">
                  Experimentar agora
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-xl border border-border/50 bg-muted/30 overflow-hidden shadow-2xl">
                {/* Placeholder para imagem/vídeo */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                  <div className="text-center space-y-4 p-8">
                    <div className="size-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto">
                      <PlayCircle className="size-8 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      Preview da plataforma
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Adicione uma imagem ou vídeo aqui
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-24 md:py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Recursos poderosos para{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                sua aprovação
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para estudar de forma inteligente e eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <Card className="group relative p-8 border border-border/50 hover:border-green-500/30 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
              <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="size-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Simulados com IA</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gere simulados personalizados baseados no edital do seu concurso. 
                A IA seleciona questões no nível certo para você.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative p-8 border border-border/50 hover:border-green-500/30 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
              <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquareText className="size-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Explicações inteligentes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Errou uma questão? A IA explica o porquê de forma clara e didática, 
                mostrando o raciocínio correto.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative p-8 border border-border/50 hover:border-green-500/30 bg-card transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5">
              <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileCheck className="size-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Correção de redações</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receba feedback instantâneo e detalhado sobre suas redações, 
                com sugestões de melhoria e pontuação estimada.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              O que nossos{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                alunos dizem
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Milhares de concurseiros já alcançaram seus objetivos com a Estudy AI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="p-6 border border-border/50 bg-card">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "A plataforma revolucionou minha forma de estudar. Os simulados personalizados são incríveis e as explicações da IA me ajudaram muito a entender onde estava errando."
              </p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  MC
                </div>
                <div>
                  <div className="font-semibold text-sm">Maria Clara</div>
                  <div className="text-xs text-muted-foreground">Aprovada em Concurso Público</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border/50 bg-card">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "A correção de redações foi fundamental para minha aprovação. Recebia feedback instantâneo e conseguia melhorar a cada texto. Recomendo muito!"
              </p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  JS
                </div>
                <div>
                  <div className="font-semibold text-sm">João Silva</div>
                  <div className="text-xs text-muted-foreground">Aprovado em Concurso Público</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 border border-border/50 bg-card">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "O melhor investimento que fiz na minha preparação. A IA realmente entende minhas dificuldades e me ajuda a focar nos pontos certos."
              </p>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
                  AS
                </div>
                <div>
                  <div className="font-semibold text-sm">Ana Santos</div>
                  <div className="text-xs text-muted-foreground">Aprovada em Concurso Público</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Por que escolher a{' '}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Estudy AI?
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Uma plataforma completa que combina tecnologia de ponta com metodologia comprovada para acelerar sua aprovação.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                    <BarChart3 className="size-6 text-white" />
                  </div>
                  <h3 className="font-semibold">Acompanhamento detalhado</h3>
                  <p className="text-sm text-muted-foreground">
                    Veja seu progresso em tempo real com estatísticas e gráficos detalhados.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                    <Shield className="size-6 text-white" />
                  </div>
                  <h3 className="font-semibold">Segurança garantida</h3>
                  <p className="text-sm text-muted-foreground">
                    Seus dados protegidos com criptografia de ponta e conformidade LGPD.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                    <Clock className="size-6 text-white" />
                  </div>
                  <h3 className="font-semibold">Economia de tempo</h3>
                  <p className="text-sm text-muted-foreground">
                    Estude de forma mais eficiente com recursos que otimizam seu tempo.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="size-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                    <Rocket className="size-6 text-white" />
                  </div>
                  <h3 className="font-semibold">Resultados rápidos</h3>
                  <p className="text-sm text-muted-foreground">
                    Algoritmos avançados que adaptam o conteúdo ao seu nível de conhecimento.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-xl border border-border/50 bg-muted/30 overflow-hidden shadow-2xl">
                {/* Placeholder para imagem de benefícios */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                  <div className="text-center space-y-4 p-8">
                    <TrendingUp className="size-16 text-green-500 mx-auto" />
                    <p className="text-sm text-muted-foreground font-medium">
                      Imagem de benefícios
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Adicione uma imagem ou ilustração aqui
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-24 md:py-32 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Escolha seu{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                plano
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Comece grátis e faça upgrade quando precisar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 space-y-6 border border-border/50 bg-card">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">Gratuito</h3>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-4xl font-bold">R$ 0</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </div>
              
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <Zap className="size-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span className="text-sm"><strong className="font-semibold text-foreground">1 simulado gerado por semana</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="size-5 text-yellow-500 shrink-0 mt-0.5" />
                  <span className="text-sm"><strong className="font-semibold text-foreground">1 correção de redação por semana</strong></span>
                </li>
              </ul>

              <Link to="/register" className="block pt-2">
                <Button className="w-full bg-transparent border border-green-500/50 hover:bg-green-500/10 shadow-md shadow-green-500/20" size="lg">
                  Começar grátis
                </Button>
              </Link>
            </Card>

            {/* Premium Plan */}
            <Card className="relative p-8 space-y-6 border-2 border-green-500/50 bg-card overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs font-semibold px-4 py-1.5 rounded-bl-lg">
                POPULAR
              </div>
              
              <div className="space-y-1 pt-4">
                <h3 className="text-2xl font-bold">Premium</h3>
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">R$ 29,90</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>
              </div>
              
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm"><strong className="font-semibold text-foreground">Simulados ilimitados</strong> gerados por IA</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm"><strong className="font-semibold text-foreground">Explicações ilimitadas</strong> de questões</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm"><strong className="font-semibold text-foreground">Correção de redações</strong> com IA</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Simulados personalizados por edital</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">Estatísticas e acompanhamento</span>
                </li>
              </ul>

              <Link to="/register" className="block pt-2">
                <Button className="w-full shadow-md shadow-green-500/20" size="lg">
                  Começar agora
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-6 py-24 md:py-32 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Perguntas{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                frequentes
              </span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Tire suas dúvidas sobre a plataforma
            </p>
          </div>

          <div className="space-y-4">
            <Card className="p-6 border border-border/50 bg-card">
              <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
                Como funciona a geração de simulados personalizados?
                <ChevronDown className="size-5 text-muted-foreground" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nossa IA analisa o edital do seu concurso e cria simulados adaptados ao seu nível de conhecimento, 
                focando nas áreas que você mais precisa estudar. Quanto mais você usa a plataforma, mais preciso fica o algoritmo.
              </p>
            </Card>

            <Card className="p-6 border border-border/50 bg-card">
              <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
                Posso cancelar minha assinatura a qualquer momento?
                <ChevronDown className="size-5 text-muted-foreground" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem nenhuma multa ou taxa adicional. 
                Seu acesso permanecerá ativo até o final do período pago.
              </p>
            </Card>

            <Card className="p-6 border border-border/50 bg-card">
              <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
                A correção de redações é realmente precisa?
                <ChevronDown className="size-5 text-muted-foreground" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Nossa IA foi treinada com milhares de redações corrigidas por especialistas e segue os critérios 
                das principais bancas examinadoras. O feedback inclui pontuação estimada e sugestões de melhoria detalhadas.
              </p>
            </Card>

            <Card className="p-6 border border-border/50 bg-card">
              <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
                Posso usar a plataforma no celular?
                <ChevronDown className="size-5 text-muted-foreground" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Sim! Nossa plataforma é totalmente responsiva e funciona perfeitamente em smartphones e tablets. 
                Você pode estudar de qualquer lugar, a qualquer momento.
              </p>
            </Card>

            <Card className="p-6 border border-border/50 bg-card">
              <h3 className="font-semibold text-lg mb-2 flex items-center justify-between">
                Quantos simulados posso fazer no plano gratuito?
                <ChevronDown className="size-5 text-muted-foreground" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No plano gratuito, você tem acesso a simulados pré-gerados ilimitados. 
                Para simulados personalizados gerados por IA, você precisa do plano Premium.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 md:py-32 relative">
        <div className="max-w-3xl mx-auto">
          <Card className="relative p-12 md:p-16 text-center border border-border/50 bg-card">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-lg"></div>
            <div className="relative space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Pronto para acelerar seus estudos?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Junte-se a milhares de concurseiros que já estão estudando de forma mais inteligente
              </p>
              <Link to="/register">
                <Button size="lg" className="text-base font-medium shadow-md shadow-green-500/10 hover:shadow-green-500/20 group">
                  Criar conta gratuita
                  <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BrainCircuit className="size-5 text-green-500" />
                <span className="font-semibold">Estudy AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plataforma de estudos com IA para concurseiros.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/termos" className="hover:text-foreground transition-colors">Termos</Link></li>
                <li><Link to="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contato" className="hover:text-foreground transition-colors">Contato</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © 2025 Estudy AI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
