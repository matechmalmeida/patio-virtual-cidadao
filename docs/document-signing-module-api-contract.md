# Document Signing Module - API Contract

Contrato da API para o modulo de assinatura de documentos do Patio Virtual.

O frontend gerencia a visualizacao e assinatura de termos legais vinculados ao caso ativo (custodia domiciliar, retirada de dispositivo, regularizacao).

---

## Endpoint

### 1. Assinar termo

```
POST /api/documents/:caseId/terms/:termId/sign
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Response

`200 OK` retorna a lista atualizada de `Term[]`.

O termo assinado tera:
- `status: 'assinado'`
- `signedAt`: ISO timestamp do momento da assinatura

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

## Interfaces

### Term

```typescript
type TermType = 'custodia_domiciliar' | 'retirada_dispositivo' | 'regularizacao';
type TermStatus = 'pendente' | 'assinado';

interface Term {
  id: string;
  type: TermType;
  title: string;
  description: string;
  content: string;
  status: TermStatus;
  signedAt?: string;
}
```

| Campo         | Tipo         | Descricao                                          |
|---------------|-------------|-----------------------------------------------------|
| `id`          | `string`    | Identificador unico do termo                        |
| `type`        | `TermType`  | Tipo do termo                                       |
| `title`       | `string`    | Titulo do documento                                 |
| `description` | `string`    | Descricao curta do documento                        |
| `content`     | `string`    | Conteudo completo do termo (texto plano)            |
| `status`      | `TermStatus`| `pendente` ou `assinado`                            |
| `signedAt`    | `string?`   | ISO timestamp da assinatura (presente se assinado)  |

### Tipos de termo

| Tipo                     | Descricao                                    |
|--------------------------|----------------------------------------------|
| `custodia_domiciliar`    | Termo de custodia domiciliar do veiculo      |
| `retirada_dispositivo`   | Termo de retirada do dispositivo GPS         |
| `regularizacao`          | Termo de regularizacao de pendencias         |

---

## Rotas do modulo

| Rota                       | Pagina               | Descricao                                      |
|----------------------------|----------------------|------------------------------------------------|
| `/app/documentos`          | DocumentListPage     | Lista de documentos (abas Pendentes/Historico) |
| `/app/documentos/:termId`  | DocumentSigningPage  | Visualizacao e assinatura de um termo          |

Todas as rotas sao protegidas por `<RequireAuth />` e renderizadas dentro de `<AppLayout />`.

---

## Fluxo de assinatura

```
DocumentListPage
  |
  Aba "Pendentes" (termos com status 'pendente')
  |
  DocumentCard (botao "Assinar")
  |
  navigate(/app/documentos/{termId})
  |
DocumentSigningPage
  |
  Exibir conteudo completo do termo (scroll obrigatorio)
  |
  [Usuario rola ate o final do documento]
  |
  Checkbox de concordancia habilitado
  |
  [Usuario marca checkbox]
  |
  Botao "Assinar" habilitado
  |
  POST /api/documents/{caseId}/terms/{termId}/sign
  |
  updateCase() com termos atualizados
  |
  Toast de sucesso
  |
  navigate(/app/documentos)
```

### Regras de UX

1. O usuario deve rolar todo o conteudo do documento antes de poder marcar o checkbox
2. O checkbox de concordancia so e habilitado apos scroll completo
3. O botao de assinar so e habilitado apos checkbox marcado
4. Se o conteudo cabe inteiro na tela (sem scroll), o checkbox e habilitado automaticamente
5. Documentos ja assinados sao exibidos em modo somente leitura com banner de sucesso

---

## Estrutura de arquivos

```
src/modules/document-signing/
  index.ts                          Barrel exports
  components/
    DocumentCard.tsx                 Card de documento com status e acao
  services/
    document.service.ts             signTerm (mock)
  pages/
    DocumentListPage.tsx            Lista com abas Pendentes e Historico
    DocumentSigningPage.tsx         Leitura e assinatura do termo
```

---

## Exports publicos (barrel)

```typescript
export { default as DocumentListPage } from './pages/DocumentListPage';
export { default as DocumentSigningPage } from './pages/DocumentSigningPage';
```

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `term.*`, `document.*`, `common.*`.
