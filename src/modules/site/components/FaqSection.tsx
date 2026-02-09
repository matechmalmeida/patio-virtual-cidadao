import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { SiteFAQ } from '@/types/site';

interface FaqSectionProps {
  faqs: SiteFAQ[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const { t } = useTranslation();

  return (
    <section id="faq" className="bg-muted/50 scroll-mt-20">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-info/10 px-3 py-1 text-xs font-semibold text-info mb-4">
            <HelpCircle className="h-3.5 w-3.5" />
            {t('landing.faqLabel')}
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {t('landing.faqTitle')}
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
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
