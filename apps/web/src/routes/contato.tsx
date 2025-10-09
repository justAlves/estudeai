import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BrainCircuit, ArrowLeft, Mail, MessageSquare, Send } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/contato')({
  component: ContatoPage,
})

function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ nome: '', email: '', assunto: '', mensagem: '' })
    
    // Reset mensagem de sucesso após 5 segundos
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Gradient Glow */}
      <div className="opacity-30 absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-green-500/20 via-emerald-500/10 to-transparent blur-3xl rounded-full pointer-events-none"></div>
      
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 backdrop-blur-sm">
              <MessageSquare className="size-5 text-green-500" />
              <span className="text-sm font-medium text-green-600">Estamos aqui para ajudar</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Entre em{' '}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Contato
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Tem alguma dúvida, sugestão ou precisa de ajuda? Envie-nos uma mensagem e 
              responderemos o mais rápido possível.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card className="p-8 backdrop-blur-sm bg-background/50 border-border/50">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo</Label>
                      <Input
                        id="nome"
                        name="nome"
                        type="text"
                        placeholder="Seu nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assunto">Assunto</Label>
                    <Input
                      id="assunto"
                      name="assunto"
                      type="text"
                      placeholder="Sobre o que você gostaria de falar?"
                      value={formData.assunto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mensagem">Mensagem</Label>
                    <textarea
                      id="mensagem"
                      name="mensagem"
                      rows={6}
                      className="w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base shadow-xs transition-all outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-transparent relative"
                      placeholder="Escreva sua mensagem aqui..."
                      value={formData.mensagem}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {submitted && (
                    <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600">
                      <p className="text-sm font-medium">✓ Mensagem enviada com sucesso!</p>
                      <p className="text-sm mt-1">Entraremos em contato em breve.</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full group shadow-lg shadow-green-500/25"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Enviando...'
                    ) : (
                      <>
                        Enviar mensagem
                        <Send className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 backdrop-blur-sm bg-background/50 border-border/50 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur-lg opacity-20"></div>
                  <div className="relative size-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <Mail className="size-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">E-mail</h3>
                  <a href="mailto:suporte@estudy.ai" className="text-muted-foreground hover:text-green-500 transition-colors">
                    suporte@estudy.ai
                  </a>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-background/50 border-border/50">
                <h3 className="font-semibold text-lg mb-4">Horário de Atendimento</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Segunda - Sexta</span>
                    <span className="font-medium">9h - 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sábado</span>
                    <span className="font-medium">9h - 14h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Domingo</span>
                    <span className="font-medium">Fechado</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 backdrop-blur-sm bg-green-500/5 border-green-500/20">
                <h3 className="font-semibold text-lg mb-3">Perguntas Frequentes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Antes de entrar em contato, veja se sua dúvida já foi respondida em nossa 
                  central de ajuda.
                </p>
                <Button variant="outline" className="w-full" size="sm">
                  Acessar FAQ
                </Button>
              </Card>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="p-6 backdrop-blur-sm bg-background/50 border-border/50 text-center">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="font-semibold mb-2">Suporte Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Resposta em até 24 horas nos dias úteis
              </p>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-background/50 border-border/50 text-center">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold mb-2">Sugestões</h3>
              <p className="text-sm text-muted-foreground">
                Adoramos ouvir ideias para melhorar a plataforma
              </p>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-background/50 border-border/50 text-center">
              <div className="text-3xl mb-2">🤝</div>
              <h3 className="font-semibold mb-2">Parcerias</h3>
              <p className="text-sm text-muted-foreground">
                Interessado em parcerias? Entre em contato
              </p>
            </Card>
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
              <Link to="/privacidade" className="text-muted-foreground hover:text-green-500 transition-colors">Privacidade</Link>
              <Link to="/contato" className="text-green-500">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
