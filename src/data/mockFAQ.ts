import type { FAQItem } from '@/types/case';

export const mockFAQ: FAQItem[] = [
  {
    id: 'faq1',
    category: 'Sobre o Pátio Virtual',
    question: 'O que é o Pátio Virtual?',
    answer:
      'O Pátio Virtual é uma alternativa à remoção do veículo para o pátio. Em vez de ter o carro guinchado, você recebe um dispositivo de monitoramento e leva o veículo para casa, onde ele fica parado até você resolver as pendências.',
  },
  {
    id: 'faq2',
    category: 'Sobre o Pátio Virtual',
    question: 'Posso usar o carro durante o processo?',
    answer:
      'Não. O veículo deve permanecer estacionado na sua residência durante todo o processo. Se o veículo for movido, o sistema detecta e isso gera uma violação, podendo resultar em remoção física.',
  },
  {
    id: 'faq3',
    category: 'Dispositivo',
    question: 'O que acontece se eu tirar o dispositivo?',
    answer:
      'A remoção do dispositivo é detectada automaticamente e gera uma violação grave. O veículo ficará sujeito à remoção física imediata para o pátio.',
  },
  {
    id: 'faq4',
    category: 'Dispositivo',
    question: 'O dispositivo pode danificar meu carro?',
    answer:
      'Não. O dispositivo é instalado na porta OBD2 do veículo (a mesma usada em revisões) e não causa nenhum dano ao veículo.',
  },
  {
    id: 'faq5',
    category: 'Pendências',
    question: 'Como resolvo minhas pendências?',
    answer:
      'Você pode pagar pelos canais habituais (banco, lotérica, app do Detran) e depois enviar o comprovante pelo portal. Nossa equipe vai verificar o pagamento.',
  },
  {
    id: 'faq6',
    category: 'Pendências',
    question: 'Meu comprovante foi recusado. O que fazer?',
    answer:
      'Confira se o comprovante está legível, com data e valor visíveis. Depois envie novamente. Se precisar de ajuda, abra um chamado pelo suporte.',
  },
  {
    id: 'faq7',
    category: 'Agendamento',
    question: 'Onde faço a retirada do dispositivo?',
    answer:
      'A retirada é feita em um dos pontos autorizados. Após regularizar tudo, você poderá agendar dia e horário diretamente pelo portal.',
  },
  {
    id: 'faq8',
    category: 'Agendamento',
    question: 'Posso reagendar?',
    answer:
      'Sim, você pode cancelar e reagendar desde que seja com pelo menos 24 horas de antecedência.',
  },
];
