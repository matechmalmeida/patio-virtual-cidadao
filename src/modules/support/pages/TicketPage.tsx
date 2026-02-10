import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

export default function TicketPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { key: 'process', label: t('ticket.categories.process') },
    { key: 'pendencies', label: t('ticket.categories.pendencies') },
    { key: 'device', label: t('ticket.categories.device') },
    { key: 'scheduling', label: t('ticket.categories.scheduling') },
    { key: 'payment', label: t('ticket.categories.payment') },
    { key: 'other', label: t('ticket.categories.other') },
  ];

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
          <h2 className="text-xl font-bold">{t('ticket.success')}</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            {t('ticket.successDesc')}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-muted rounded-lg px-4 py-3">
            <span className="text-xs text-muted-foreground">{t('ticket.protocol')}</span>
            <span className="font-bold tracking-wider">{protocol}</span>
            <button onClick={handleCopy} className="ml-1">
              <Copy className={`h-4 w-4 ${copied ? 'text-success' : 'text-muted-foreground'}`} />
            </button>
          </div>
          {copied && (
            <p className="text-xs text-success mt-1">{t('common.copied')}</p>
          )}

          <div className="mt-6">
            <Button
              onClick={() => navigate('/app/suporte')}
              className="h-11 font-semibold"
            >
              {t('ticket.backToSupport')}
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
        {t('common.back')}
      </Button>

      <h1 className="text-xl font-bold">{t('ticket.title')}</h1>
      <p className="text-sm text-muted-foreground">
        {t('ticket.subtitle')}
      </p>

      <Card className="border-0 shadow-md">
        <CardContent className="pt-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('ticket.category')}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder={t('ticket.categoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.key} value={cat.key}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('ticket.description')}</Label>
              <Textarea
                placeholder={t('ticket.descriptionPlaceholder')}
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
              <Label>{t('ticket.attachment')}</Label>
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
                  {t('ticket.attachFile')}
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
                  {t('ticket.submitting')}
                </>
              ) : (
                t('ticket.submit')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
