# Support Module - API Contract

Contrato da API para o modulo de suporte do Patio Virtual.

O frontend permite ao cidadao consultar perguntas frequentes (FAQ) e abrir chamados de suporte.

---

## Endpoints

### 1. Listar perguntas frequentes

```
GET /api/support/faq
```

#### Response

`200 OK` retorna um array de `FAQItem`.

```typescript
interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}
```

| Campo      | Tipo     | Descricao                                 |
|------------|----------|-------------------------------------------|
| `id`       | `string` | Identificador unico da pergunta           |
| `category` | `string` | Categoria da pergunta para agrupamento    |
| `question` | `string` | Texto da pergunta                         |
| `answer`   | `string` | Texto da resposta                         |

#### Categorias disponíveis (mock)

| Categoria             | Qtd perguntas |
|-----------------------|---------------|
| Sobre o Patio Virtual | 2             |
| Dispositivo           | 2             |
| Pendencias            | 2             |
| Agendamento           | 2             |

#### Dados de teste (mock)

| ID    | Categoria             | Pergunta                                        |
|-------|-----------------------|-------------------------------------------------|
| faq1  | Sobre o Patio Virtual | O que e o Patio Virtual?                        |
| faq2  | Sobre o Patio Virtual | Posso usar o carro durante o processo?           |
| faq3  | Dispositivo           | O que acontece se eu tirar o dispositivo?        |
| faq4  | Dispositivo           | O dispositivo pode danificar meu carro?          |
| faq5  | Pendencias            | Como resolvo minhas pendencias?                  |
| faq6  | Pendencias            | Meu comprovante foi recusado. O que fazer?       |
| faq7  | Agendamento           | Onde faco a retirada do dispositivo?             |
| faq8  | Agendamento           | Posso reagendar?                                 |

---

### 2. Abrir chamado de suporte

```
POST /api/support/tickets
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Request Body

```typescript
{
  category: string;
  description: string;
}
```

| Campo         | Tipo     | Obrigatorio | Descricao                              |
|---------------|----------|-------------|----------------------------------------|
| `category`    | `string` | Sim         | Categoria do chamado                   |
| `description` | `string` | Sim         | Descricao detalhada do problema        |

#### Response

`200 OK` retorna o chamado criado.

```typescript
interface SupportTicket {
  id: string;
  category: string;
  description: string;
  protocol: string;
  createdAt: string;
}
```

| Campo         | Tipo     | Descricao                                          |
|---------------|----------|----------------------------------------------------|
| `id`          | `string` | Identificador unico do chamado                     |
| `category`    | `string` | Categoria selecionada                              |
| `description` | `string` | Descricao do problema                              |
| `protocol`    | `string` | Numero de protocolo (formato `SUP-XXXXXX`)         |
| `createdAt`   | `string` | ISO timestamp da criacao                           |

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

## Categorias de chamado

| Valor                  | Descricao                           |
|------------------------|--------------------------------------|
| Problema tecnico       | Problemas com o sistema ou portal   |
| Dispositivo            | Problemas com o dispositivo GPS     |
| Pagamento              | Duvidas ou problemas de pagamento   |
| Documento              | Problemas com documentos            |
| Agendamento            | Problemas com agendamento           |
| Outro                  | Outros assuntos                     |

---

## Rotas do modulo

| Rota                    | Pagina       | Descricao                              |
|-------------------------|--------------|----------------------------------------|
| `/app/suporte`          | SupportPage  | FAQ com busca e formulario de chamado  |
| `/app/suporte/chamado`  | TicketPage   | Abertura de chamado de suporte         |

Todas as rotas sao protegidas por `<RequireAuth />` e renderizadas dentro de `<AppLayout />`.

---

## Fluxo de suporte

### Consultar FAQ

```
SupportPage
  |
  GET /api/support/faq
  |
  Exibir perguntas agrupadas por categoria
  |
  Campo de busca filtra por texto na pergunta/resposta
  |
  Accordion expansivel para cada pergunta
```

### Abrir chamado

```
SupportPage
  |
  Botao "Abrir chamado"
  |
  navigate(/app/suporte/chamado)
  |
TicketPage
  |
  Selecionar categoria (dropdown)
  |
  Preencher descricao (textarea)
  |
  POST /api/support/tickets
  |
  Tela de sucesso com numero de protocolo
  |
  Botao "Voltar para suporte"
```

---

## Validacao de formularios (frontend)

### Abertura de chamado

| Campo       | Regras                          |
|-------------|----------------------------------|
| category    | Obrigatorio                     |
| description | Obrigatorio, min. 10 caracteres |

---

## Estrutura de arquivos

```
src/modules/support/
  index.ts                          Barrel exports
  services/
    support.service.ts              getFAQ, createTicket
  pages/
    SupportPage.tsx                 FAQ com busca e link para chamado
    TicketPage.tsx                  Formulario de abertura de chamado
```

---

## Exports publicos (barrel)

```typescript
export { default as SupportPage } from './pages/SupportPage';
export { default as TicketPage } from './pages/TicketPage';
```

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `support.*`, `common.*`.
