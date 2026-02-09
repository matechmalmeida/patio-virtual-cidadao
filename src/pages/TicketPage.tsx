import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Upload, CheckCircle2, Copy, X } from 'lucide-react';

const categories = [
  'Dúvidas sobre o processo',
  'Problema com pendências',
  'Problema com o dispositivo',
  'Agendamento',
  'Pagamento',
  'Outro',
];

export default function TicketPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [protocol, setProtocol] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const proto = 'SUP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      setProtocol(proto);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleCopy = () => {
    if (protocol) {
      navigator.clipboard.writeText(protocol);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (protocol) {
    return (
      <div className="px-4 py-5 space-y-5">
        <div className="text-center py-8">
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-xl font-bold">Chamado aberto!</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            Recebemos sua solicitação. Nossa equipe vai responder em até 48 horas úteis.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-muted rounded-lg px-4 py-3">
            <span className="text-xs text-muted-foreground">Protocolo:</span>
            <span className="font-bold tracking-wider">{protocol}</span>
            <button onClick={handleCopy} className="ml-1">
              <Copy className={`h-4 w-4 ${copied ? 'text-success' : 'text-muted-foreground'}`} />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-success mt-1">Copiado!</p>
          )}

          <div className="mt-6">
            <Button
              onClick={() => navigate('/suporte')}
              className="h-11 font-semibold"
            >
              Voltar ao suporte
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

      <h1 className="text-xl font-bold">Abrir chamado</h1>
      <p className="text-sm text-muted-foreground">
        Descreva o que está acontecendo. Vamos ajudar o mais rápido possível.
      </p>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Descreva o problema</Label>
              <Textarea
                placeholder="Conte com detalhes o que está acontecendo..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={1000}
              />
              <p className="text-[11px] text-muted-foreground text-right">
                {description.length}/1000
              </p>
            </div>

            <div className="space-y-2">
              <Label>Anexo (opcional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50">
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <button onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4" />
                  Anexar arquivo
                </Button>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-semibold"
              disabled={!category || !description.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar chamado'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
