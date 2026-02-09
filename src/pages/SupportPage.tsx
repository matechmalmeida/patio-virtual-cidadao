import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Search,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  History,
  LogOut,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import type { FAQItem } from '@/types/case';
import { getFaqItems } from '@/services/support.service';
import { AlertBanner } from '@/components/AlertBanner';
import { getApiErrorMessage } from '@/services/http/api-error';

export default function SupportPage() {
  const [search, setSearch] = useState('');
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    let isMounted = true;
    getFaqItems()
      .then((items) => {
        if (!isMounted) return;
        setFaqItems(items);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(getApiErrorMessage(err, 'Não foi possível carregar as perguntas frequentes.'));
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [...new Set(faqItems.map((f) => f.category))];

  const filteredFAQ = search.trim()
    ? faqItems.filter(
        (f) =>
          f.question.toLowerCase().includes(search.toLowerCase()) ||
          f.answer.toLowerCase().includes(search.toLowerCase())
      )
    : faqItems;

  const handleLogout = () => {
    logout();
    navigate('/acesso');
  };

  return (
    <div className="px-4 py-5 space-y-5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="-ml-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </Button>

      <h1 className="text-xl font-bold">Ajuda e Suporte</h1>
      {error && <AlertBanner variant="error">{error}</AlertBanner>}

      {/* Quick actions */}
      <div className="space-y-2">
        <Link
          to="/suporte/chamado"
          className="flex items-center justify-between p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Abrir chamado</p>
              <p className="text-xs text-muted-foreground">Fale com nossa equipe</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <Link
          to="/historico"
          className="flex items-center justify-between p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <History className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Histórico de casos</p>
              <p className="text-xs text-muted-foreground">Ver casos anteriores</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center justify-between p-4 rounded-xl bg-card border hover:bg-muted/50 transition-colors w-full text-left"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-destructive">Sair da conta</p>
              <p className="text-xs text-muted-foreground">Encerrar sessão</p>
            </div>
          </div>
        </button>
      </div>

      {/* FAQ section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Perguntas frequentes</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pergunta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {(search.trim() ? ['Resultados'] : categories).map((category) => {
          const items = search.trim()
            ? filteredFAQ
            : filteredFAQ.filter((f) => f.category === category);

          if (items.length === 0) return null;

          return (
            <div key={category}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {category}
              </p>
              <Accordion type="single" collapsible>
                {items.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-sm text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          );
        })}

        {filteredFAQ.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhuma pergunta encontrada.
          </p>
        )}
      </div>
    </div>
  );
}
