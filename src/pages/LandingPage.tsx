import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Car,
  ShieldCheck,
  Clock,
  Wallet,
  MapPin,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Home,
  CalendarDays,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import heroBg from '@/assets/hero-bg.jpg';

const advantages = [
  {
    icon: Home,
    title: 'Seu carro fica em casa',
    description: 'Em vez de ir para o pátio, o veículo vai direto para sua residência com um dispositivo de monitoramento.',
  },
  {
    icon: Wallet,
    title: 'Economia real',
    description: 'Sem custos de guincho, diárias de pátio ou taxas extras. Você paga apenas suas pendências.',
  },
  {
    icon: Clock,
    title: 'Resolva pelo celular',
    description: 'Acompanhe pendências, envie comprovantes e agende a retirada do dispositivo — tudo online.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguro e transparente',
    description: 'Todo o processo é registrado digitalmente com auditoria completa e timeline em tempo real.',
  },
  {
    icon: Smartphone,
    title: 'Sem burocracia',
    description: 'Acesse o portal com o código do caso e resolva tudo sem filas, sem deslocamentos.',
  },
  {
    icon: CalendarDays,
    title: 'Agendamento fácil',
    description: 'Quando tudo estiver regularizado, agende dia e horário para retirar o dispositivo.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Abordagem na blitz',
    description: 'O agente identifica a irregularidade e oferece o Pátio Virtual como alternativa à remoção.',
    icon: Car,
  },
  {
    number: '02',
    title: 'Dispositivo instalado',
    description: 'Um dispositivo GPS é conectado ao veículo. Você leva o carro para casa em segurança.',
    icon: MapPin,
  },
  {
    number: '03',
    title: 'Regularize online',
    description: 'Acesse o portal, veja suas pendências, pague e envie os comprovantes pelo celular.',
    icon: FileCheck,
  },
  {
    number: '04',
    title: 'Retire o dispositivo',
    description: 'Com tudo regularizado, agende a retirada do dispositivo em um ponto autorizado.',
    icon: CheckCircle2,
  },
];

const faqs = [
  {
    q: 'O que é o Pátio Virtual?',
    a: 'É um programa que substitui a remoção do veículo para o pátio. Em vez de ter o carro guinchado, você instala um dispositivo de monitoramento e leva o veículo para casa até regularizar as pendências.',
  },
  {
    q: 'Posso usar o carro durante o processo?',
    a: 'Não. O veículo deve permanecer estacionado na sua residência durante todo o processo de regularização. O sistema monitora e detecta qualquer movimentação.',
  },
  {
    q: 'Quanto custa?',
    a: 'Não há custo de guincho nem diárias de pátio. Você paga apenas as pendências do seu veículo (multas, licenciamento, etc.).',
  },
  {
    q: 'E se eu tirar o dispositivo?',
    a: 'A remoção é detectada automaticamente e gera uma violação grave, podendo resultar na remoção física do veículo para o pátio.',
  },
  {
    q: 'Como acesso o portal?',
    a: 'Basta usar o código do caso que você recebeu durante a abordagem e o telefone cadastrado. Você receberá um código SMS para verificação.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-lg border-b">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Pátio Virtual</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
              <a href="#como-funciona">Como funciona</a>
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
              <a href="#vantagens">Vantagens</a>
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
              <a href="#faq">Dúvidas</a>
            </Button>
            <Button size="sm" className="font-semibold" asChild>
              <Link to="/acesso">
                Acessar meu caso
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 top-16">
          <img
            src={heroBg}
            alt="Cidade com rotas GPS"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-background" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-20 md:pt-32 pb-20 md:pb-40">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-semibold text-primary-foreground backdrop-blur mb-6">
              <ShieldCheck className="h-3.5 w-3.5" />
              Programa oficial da autarquia de trânsito
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-[1.1] tracking-tight">
              Seu carro fica em casa,{' '}
              <span className="text-primary">não no pátio.</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-primary-foreground/80 leading-relaxed max-w-lg">
              O Pátio Virtual substitui a remoção do veículo. Resolva suas pendências pelo celular e evite guincho, diárias e burocracia.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" className="h-13 px-8 text-base font-bold shadow-lg" asChild>
                <Link to="/acesso">
                  Acessar meu caso
                  <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base font-semibold bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 hover:text-primary-foreground"
                asChild
              >
                <a href="#como-funciona">
                  Como funciona
                  <ChevronDown className="h-5 w-5 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative -mt-8 z-10 max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            { value: 'R$ 0', label: 'Taxa de guincho' },
            { value: 'R$ 0', label: 'Diárias de pátio' },
            { value: '100%', label: 'Digital e online' },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-lg">
              <CardContent className="pt-5 pb-5 text-center">
                <p className="text-xl md:text-3xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-[11px] md:text-sm text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28 scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
            Passo a passo
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Como funciona o Pátio Virtual
          </h2>
          <p className="text-muted-foreground mt-3 text-sm md:text-base">
            Um processo simples, transparente e 100% digital.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <Card className="border-0 shadow-md h-full transition-shadow hover:shadow-xl">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-extrabold text-primary/20">{step.number}</span>
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section id="vantagens" className="bg-muted/50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
          <div className="text-center max-w-xl mx-auto mb-12 md:mb-16">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success mb-4">
              Benefícios
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Vantagens para o cidadão
            </h2>
            <p className="text-muted-foreground mt-3 text-sm md:text-base">
              Menos estresse, menos custo e mais praticidade.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((adv) => (
              <Card key={adv.title} className="border-0 shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="pt-6 pb-6">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <adv.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-base font-bold mb-1.5">{adv.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{adv.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Pátio Virtual vs. Pátio Tradicional
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Traditional */}
          <Card className="border-2 border-destructive/20">
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Car className="h-4 w-4 text-destructive" />
                </div>
                <h3 className="font-bold text-destructive">Pátio Tradicional</h3>
              </div>
              {[
                'Veículo guinchado',
                'Custo de guincho + diárias',
                'Deslocamento até o pátio',
                'Filas e burocracia presencial',
                'Risco de danos ao veículo',
                'Processo demorado',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                    <span className="text-destructive text-xs font-bold">✕</span>
                  </span>
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Virtual */}
          <Card className="border-2 border-success/30 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-success text-success-foreground text-[10px] font-bold px-3 py-1 rounded-bl-lg">
              RECOMENDADO
            </div>
            <CardContent className="pt-6 pb-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Home className="h-4 w-4 text-success" />
                </div>
                <h3 className="font-bold text-success">Pátio Virtual</h3>
              </div>
              {[
                'Veículo fica em casa',
                'Sem custos de guincho ou diárias',
                'Resolva tudo pelo celular',
                '100% digital, sem filas',
                'Veículo seguro na sua residência',
                'Processo rápido e transparente',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <span className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  </span>
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-muted/50 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-28">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info mb-4">
              <HelpCircle className="h-3.5 w-3.5" />
              Tire suas dúvidas
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
              Perguntas frequentes
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-xl border shadow-sm px-5"
              >
                <AccordionTrigger className="text-sm md:text-base text-left font-semibold py-4 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <Card className="border-0 shadow-2xl bg-primary overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
          <CardContent className="relative pt-10 pb-10 md:pt-16 md:pb-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-5">
              <Car className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary-foreground mb-3">
              Acesse seu caso agora
            </h2>
            <p className="text-primary-foreground/80 text-sm md:text-base max-w-md mx-auto mb-8">
              Use o código que você recebeu durante a abordagem para acompanhar e resolver suas pendências.
            </p>
            <Button
              size="lg"
              className="h-13 px-10 text-base font-bold bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-lg"
              asChild
            >
              <Link to="/acesso">
                Acessar meu caso
                <ArrowRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Car className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">Pátio Virtual</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
              <a href="#vantagens" className="hover:text-foreground transition-colors">Vantagens</a>
              <a href="#faq" className="hover:text-foreground transition-colors">Dúvidas</a>
              <Link to="/acesso" className="hover:text-foreground transition-colors">Acessar</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-xs text-muted-foreground/60">
            Pátio Virtual © 2026 — Todos os direitos reservados. Programa oficial da autarquia de trânsito.
          </div>
        </div>
      </footer>
    </div>
  );
}
