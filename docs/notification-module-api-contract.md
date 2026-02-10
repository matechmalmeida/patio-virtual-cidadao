# Notification Module - API Contract

Contrato da API para o modulo de notificacoes do Patio Virtual.

O frontend gerencia notificacoes in-app (vinculadas ao caso ativo) e configuracoes de push notifications do navegador.

---

## Tipos

### Notification

```typescript
type NotificationType = 'info' | 'alert' | 'critical';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  timestamp: string;
  actionLink?: string;
  actionLabel?: string;
}
```

| Campo         | Tipo                | Descricao                                            |
|---------------|---------------------|------------------------------------------------------|
| `id`          | `string`            | Identificador unico da notificacao                   |
| `title`       | `string`            | Titulo da notificacao                                |
| `message`     | `string`            | Corpo da mensagem                                    |
| `type`        | `NotificationType`  | Tipo: `info`, `alert` ou `critical`                  |
| `read`        | `boolean`           | Se ja foi lida                                       |
| `timestamp`   | `string`            | ISO timestamp de quando foi criada                   |
| `actionLink`  | `string?`           | URL opcional para acao (navegacao interna)            |
| `actionLabel` | `string?`           | Label opcional do botao de acao                      |

---

## Endpoints

### 1. Listar notificacoes

```
GET /api/notifications/:caseId
```

#### Response

`200 OK` retorna um array de `Notification`.

```typescript
Notification[]
```

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

### 2. Marcar notificacao como lida

```
PATCH /api/notifications/:caseId/:notificationId/read
```

#### Response

`200 OK` retorna a lista atualizada de `Notification[]`.

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

### 3. Marcar todas como lidas

```
PATCH /api/notifications/:caseId/read-all
```

#### Response

`200 OK` retorna a lista atualizada de `Notification[]` com todas as notificacoes marcadas como `read: true`.

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

### 4. Deletar notificacao

```
DELETE /api/notifications/:caseId/:notificationId
```

#### Response

`200 OK` retorna a lista atualizada de `Notification[]` sem a notificacao removida.

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

### 5. Marcar lote como lidas

```
PATCH /api/notifications/:caseId/batch/read
```

#### Request Body

```typescript
{
  ids: string[];
}
```

| Campo | Tipo       | Obrigatorio | Descricao                                |
|-------|------------|-------------|------------------------------------------|
| `ids` | `string[]` | Sim         | Array de IDs das notificacoes a marcar   |

#### Response

`200 OK` retorna a lista atualizada de `Notification[]`.

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

### 6. Deletar lote

```
DELETE /api/notifications/:caseId/batch
```

#### Request Body

```typescript
{
  ids: string[];
}
```

| Campo | Tipo       | Obrigatorio | Descricao                                |
|-------|------------|-------------|------------------------------------------|
| `ids` | `string[]` | Sim         | Array de IDs das notificacoes a remover  |

#### Response

`200 OK` retorna a lista atualizada de `Notification[]`.

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

## Filtros disponíveis

O frontend implementa tres filtros sobre as notificacoes:

| Filtro        | Regra                                          |
|---------------|-------------------------------------------------|
| `todos`       | Todas as notificacoes                           |
| `importantes` | `type === 'critical'` ou `type === 'alert'`     |
| `pendentes`   | `read === false`                                |

---

## Push Notifications (navegador)

O modulo inclui suporte a push notifications nativas do navegador via `usePushNotifications()` hook.

### Tipos de notificacao configuráveis

| Tipo                | Descricao                                |
|---------------------|------------------------------------------|
| Status change       | Alteracao de status do caso              |
| Docs analyzed       | Documentos analisados                    |
| Deadline            | Alertas de prazo                         |
| Movement alert      | Alerta de movimentacao do veiculo        |

### Comportamento

- Detecta suporte via `'Notification' in window && 'serviceWorker' in navigator`
- Permissao pode ser `'granted'`, `'denied'` ou `'default'`
- Utiliza icone `/pwa-192x192.png` nas notificacoes
- Fallback para `ServiceWorkerRegistration.showNotification()` quando disponivel

---

## Rotas do modulo

| Rota                            | Pagina                    | Descricao                           |
|---------------------------------|---------------------------|--------------------------------------|
| `/app/notifications`            | NotificationsPage         | Lista de notificacoes com filtros   |
| `/app/notifications/settings`   | NotificationSettingsPage  | Configuracoes de push notifications |

Todas as rotas sao protegidas por `<RequireAuth />` e renderizadas dentro de `<AppLayout />`.

---

## Estrutura de arquivos

```
src/modules/notification/
  index.ts                              Barrel exports
  types/
    notification.ts                     Notification, NotificationType
  services/
    notification.service.ts             fetchNotifications, markAsRead, markAllAsRead, deleteNotification, markBatchAsRead, deleteBatch
  hooks/
    useNotifications.ts                 Hook principal de gerenciamento de notificacoes
    usePushNotifications.ts             Hook de push notifications do navegador
  components/
    NotificationBadge.tsx               Badge com contagem de nao lidas
    NotificationItem.tsx                Card individual de notificacao
    BatchActionBar.tsx                  Barra de acoes em lote (interno)
  pages/
    NotificationsPage.tsx               Lista de notificacoes com filtros e selecao em lote
    NotificationSettingsPage.tsx        Configuracoes de push notifications
```

---

## Exports publicos (barrel)

```typescript
export { useNotifications } from './hooks/useNotifications';
export { usePushNotifications } from './hooks/usePushNotifications';
export { NotificationBadge } from './components/NotificationBadge';
export { NotificationItem } from './components/NotificationItem';
export type { Notification, NotificationType } from './types/notification';
```

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `notificationsPage.*`, `notifications.*`, `common.*`.
