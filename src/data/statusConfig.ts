export const statusLabels: Record<string, string> = {
  em_deslocamento: 'Em deslocamento',
  custodia_domiciliar: 'Em custódia domiciliar',
  pendencias_regularizar: 'Pendências a regularizar',
  aguardando_validacao: 'Aguardando validação',
  apto_retirada: 'Apto para retirada',
  aguardando_retirada: 'Aguardando retirada',
  finalizado: 'Finalizado',
};

export const statusDescriptions: Record<string, string> = {
  em_deslocamento: 'Você está a caminho da sua residência. Siga direto para casa.',
  custodia_domiciliar: 'Seu veículo está em regime de custódia. Não pode ser movido.',
  pendencias_regularizar: 'Você tem pendências para resolver antes de liberar o veículo.',
  aguardando_validacao: 'Estamos verificando seus documentos. Aguarde.',
  apto_retirada: 'Tudo certo! Agende a retirada do dispositivo.',
  aguardando_retirada: 'Agendamento confirmado. Compareça no dia e horário marcados.',
  finalizado: 'Processo concluído com sucesso!',
};

export const pendencyStatusLabels: Record<string, string> = {
  pendente: 'Pendente',
  enviado: 'Enviado',
  em_analise: 'Em análise',
  aprovado: 'Aprovado',
  reprovado: 'Reprovado',
};
