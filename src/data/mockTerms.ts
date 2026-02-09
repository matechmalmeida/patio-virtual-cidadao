import type { Term } from '@/types/case';

const CUSTODIA_CONTENT = `
TERMO DE CUSTÓDIA DOMICILIAR DE VEÍCULO APREENDIDO

CLÁUSULA 1 — DO OBJETO

O presente Termo tem como objeto a custódia domiciliar do veículo apreendido, conforme previsto na legislação de trânsito vigente, em substituição à remoção ao pátio de apreensão.

O veículo será mantido na residência do proprietário/possuidor, equipado com dispositivo de monitoramento por GPS (OBD2), sob as condições estabelecidas neste instrumento.

CLÁUSULA 2 — DAS OBRIGAÇÕES DO CUSTODIANTE

O custodiante se compromete a:

a) Manter o veículo estacionado exclusivamente no endereço registrado neste Termo, sem movimentá-lo sob qualquer pretexto, salvo autorização expressa da autoridade competente;

b) Não desconectar, danificar, obstruir ou de qualquer forma interferir no funcionamento do dispositivo GPS instalado no veículo;

c) Manter o veículo acessível para eventual fiscalização ou vistoria por parte dos agentes de trânsito, a qualquer momento;

d) Comunicar imediatamente à central de monitoramento qualquer situação que possa comprometer a integridade do veículo ou do dispositivo (furto, acidente, pane elétrica, etc.);

e) Não permitir que terceiros utilizem ou movimentem o veículo;

f) Preservar o estado geral do veículo, não realizando modificações na estrutura, motor ou sistema elétrico.

CLÁUSULA 3 — DAS RESTRIÇÕES

Durante a custódia domiciliar:

I. O veículo NÃO pode circular em vias públicas;
II. O veículo NÃO pode ser vendido, transferido ou alienado;
III. O dispositivo GPS deve permanecer ativo e com alimentação elétrica;
IV. Qualquer movimentação não autorizada será detectada e registrada automaticamente.

CLÁUSULA 4 — DAS CONSEQUÊNCIAS DO DESCUMPRIMENTO

O descumprimento de qualquer cláusula deste Termo acarretará:

a) Remoção imediata do veículo ao pátio de apreensão, às custas do proprietário;
b) Cobrança integral das diárias de pátio desde a data da apreensão original;
c) Instauração de procedimento administrativo;
d) Aplicação das penalidades previstas nos artigos 230 e 231 do Código de Trânsito Brasileiro;
e) Possibilidade de responsabilização criminal, quando aplicável.

CLÁUSULA 5 — DO PRAZO

A custódia domiciliar vigorará pelo período necessário à regularização de todas as pendências que motivaram a apreensão, até a efetiva retirada do dispositivo GPS e liberação definitiva do veículo.

O prazo máximo para regularização é de 30 (trinta) dias corridos a contar da data de assinatura deste Termo, podendo ser prorrogado mediante solicitação fundamentada.

CLÁUSULA 6 — DA RESPONSABILIDADE

O custodiante assume integral responsabilidade pela guarda e conservação do veículo e do dispositivo de monitoramento, respondendo por quaisquer danos, avarias ou desaparecimento que venham a ocorrer durante o período de custódia.

CLÁUSULA 7 — DAS DISPOSIÇÕES FINAIS

O custodiante declara ter ciência de todas as condições estabelecidas neste Termo e se compromete a cumpri-las integralmente.

Este Termo é firmado em caráter irrevogável e irretratável, produzindo efeitos a partir da data de sua assinatura digital.
`.trim();

const RETIRADA_CONTENT = `
TERMO DE AUTORIZAÇÃO PARA RETIRADA DO DISPOSITIVO DE MONITORAMENTO

CLÁUSULA 1 — DO OBJETO

O presente Termo autoriza a retirada do dispositivo de monitoramento GPS (OBD2) instalado no veículo apreendido, em razão da regularização integral de todas as pendências que motivaram a apreensão.

CLÁUSULA 2 — DA CONFIRMAÇÃO DE REGULARIZAÇÃO

O signatário declara estar ciente de que:

a) Todas as pendências administrativas, tributárias e legais vinculadas ao veículo foram devidamente regularizadas e comprovadas;

b) Os comprovantes apresentados foram analisados e aprovados pela autoridade competente;

c) Não existem impedimentos remanescentes para a liberação do veículo.

CLÁUSULA 3 — DO PROCEDIMENTO DE RETIRADA

Para a retirada do dispositivo:

I. O proprietário deverá comparecer ao local agendado na data e horário definidos, portando documento de identidade com foto e documento do veículo;

II. A retirada será realizada exclusivamente por técnico autorizado;

III. O procedimento tem duração estimada de 15 a 30 minutos;

IV. O veículo deve estar presente no local para remoção do equipamento;

V. Caso o proprietário não compareça, um novo agendamento deverá ser feito.

CLÁUSULA 4 — DA LIBERAÇÃO DO VEÍCULO

Após a retirada do dispositivo:

a) O veículo será considerado totalmente liberado e poderá circular normalmente;

b) O processo de apreensão será encerrado e arquivado;

c) Um comprovante digital de liberação será disponibilizado no portal;

d) O histórico do processo permanecerá acessível para consulta.

CLÁUSULA 5 — DAS CONDIÇÕES

O signatário declara que:

a) O dispositivo GPS instalado no veículo não sofreu avarias, danos ou tentativas de remoção não autorizadas durante o período de custódia;

b) O veículo permaneceu estacionado na residência cadastrada durante todo o período, conforme estipulado no Termo de Custódia Domiciliar;

c) Não há pendências financeiras relativas ao serviço de monitoramento.

CLÁUSULA 6 — DA RESPONSABILIDADE POR DANOS AO DISPOSITIVO

Caso seja constatado dano ao dispositivo de monitoramento durante a retirada, o custodiante será responsabilizado pelos custos de reparo ou substituição do equipamento, conforme tabela de valores vigente.

CLÁUSULA 7 — DAS DISPOSIÇÕES FINAIS

O signatário declara ter lido e compreendido todas as cláusulas deste Termo, concordando integralmente com seus termos.

A assinatura digital deste documento tem valor legal equivalente à assinatura manuscrita, conforme Lei nº 14.063/2020.

Este Termo produz efeitos imediatos a partir da confirmação da assinatura digital.
`.trim();

const REGULARIZACAO_CONTENT = `
TERMO DE COMPROMISSO DE REGULARIZAÇÃO VEICULAR

CLÁUSULA 1 — DO OBJETO

O presente Termo tem como objeto o compromisso de regularização integral das pendências administrativas, tributárias e documentais do veículo apreendido, como condição para a liberação definitiva e encerramento do processo de custódia domiciliar.

CLÁUSULA 2 — DAS PENDÊNCIAS A REGULARIZAR

O signatário declara estar ciente das seguintes pendências vinculadas ao veículo:

a) Multas de trânsito vencidas e não pagas;
b) Licenciamento anual do veículo (CRLV);
c) IPVA (Imposto sobre a Propriedade de Veículos Automotores) em atraso;
d) Seguro obrigatório (DPVAT/SPVAT);
e) Eventuais taxas administrativas decorrentes do processo de apreensão.

CLÁUSULA 3 — DO PRAZO PARA REGULARIZAÇÃO

O signatário compromete-se a regularizar todas as pendências no prazo máximo de 30 (trinta) dias corridos a contar da data de assinatura deste Termo.

O não cumprimento do prazo poderá acarretar:
I. Aplicação de multas adicionais;
II. Remoção do veículo ao pátio de apreensão;
III. Cobrança retroativa de diárias de pátio.

CLÁUSULA 4 — DA COMPROVAÇÃO

A regularização deverá ser comprovada por meio do envio dos comprovantes de pagamento e documentos atualizados através do portal digital Pátio Virtual.

Os comprovantes serão analisados pela autoridade competente no prazo de até 48 horas úteis após o envio.

CLÁUSULA 5 — DAS CONSEQUÊNCIAS DA NÃO REGULARIZAÇÃO

Caso as pendências não sejam regularizadas no prazo estabelecido:

a) O veículo será removido ao pátio de apreensão;
b) Serão cobradas diárias de pátio retroativas;
c) O processo administrativo será encaminhado para leilão, conforme previsto no Código de Trânsito Brasileiro;
d) O proprietário será responsável por todas as custas decorrentes.

CLÁUSULA 6 — DAS DISPOSIÇÕES FINAIS

O signatário declara ter ciência de todas as condições e consequências estabelecidas neste Termo, comprometendo-se a cumpri-las integralmente.

Este Termo é firmado em caráter irrevogável, produzindo efeitos a partir da confirmação da assinatura digital.
`.trim();

export function getMockTermsForCase(caseId: string): Term[] {
  if (caseId === '1') {
    return [
      {
        id: 'term-custodia-1',
        type: 'custodia_domiciliar',
        title: 'Termo de Custódia Domiciliar',
        description: 'Leia e aceite os termos para manter o veículo em custódia domiciliar.',
        content: CUSTODIA_CONTENT,
        status: 'pendente',
      },
      {
        id: 'term-regularizacao-1',
        type: 'regularizacao',
        title: 'Termo de Compromisso de Regularização',
        description: 'Comprometa-se a regularizar todas as pendências do veículo no prazo.',
        content: REGULARIZACAO_CONTENT,
        status: 'pendente',
      },
    ];
  }
  if (caseId === '2') {
    return [
      {
        id: 'term-custodia-2',
        type: 'custodia_domiciliar',
        title: 'Termo de Custódia Domiciliar',
        description: 'Leia e aceite os termos para manter o veículo em custódia domiciliar.',
        content: CUSTODIA_CONTENT,
        status: 'assinado',
        signedAt: '2026-02-06T15:12:00',
      },
      {
        id: 'term-retirada-2',
        type: 'retirada_dispositivo',
        title: 'Termo de Retirada do Dispositivo',
        description: 'Autorize a retirada do dispositivo GPS após regularização.',
        content: RETIRADA_CONTENT,
        status: 'pendente',
      },
    ];
  }
  return [];
}
