# Process Module - API Contract

Contrato da API para o modulo de processos/casos do Patio Virtual.

O frontend gerencia os casos ativos do cidadao, incluindo detalhes do caso, pendencias (upload de comprovantes e pagamentos), timeline, historico e status do dispositivo GPS.

---

## Endpoints

### 1. Enviar comprovante de pendencia

```
POST /api/process/:caseId/pendencies/:pendencyId/upload
```

#### Request Body (multipart/form-data)

| Campo      | Tipo     | Obrigatorio | Descricao                          |
|------------|----------|-------------|------------------------------------|
| `file`     | `File`   | Sim         | Arquivo de comprovante (imagem ou PDF) |

#### Response

`200 OK` retorna a lista atualizada de pendencias.

```typescript
Pendency[]
```

A pendencia enviada tera `status: 'enviado'` e `uploadedFile` preenchido com o nome do arquivo.

#### Erros

| Status | Codigo      | Condicao           | userMessage                |
|--------|-------------|--------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

### 2. Confirmar pagamento de pendencia

```
POST /api/process/:caseId/pendencies/:pendencyId/payment
```

#### Response

`200 OK` retorna a lista atualizada de pendencias.

```typescript
Pendency[]
```

A pendencia confirmada tera `status: 'enviado'`.

#### Erros

| Status | Codigo      | Condicao           | userMessage                |
|--------|-------------|--------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

### 3. Consultar status do dispositivo GPS

```
GET /api/process/:caseId/gps
```

#### Response

`200 OK` retorna um objeto `GPSDeviceData`.

```typescript
interface GPSDeviceData {
  deviceId: string;
  status: 'ativo' | 'inativo' | 'alerta';
  batteryLevel: number;
  signalStrength: 'forte' | 'moderado' | 'fraco';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastTransmission: string;
  installedAt: string;
  firmwareVersion: string;
  transmissionHistory: TransmissionEvent[];
}

interface TransmissionEvent {
  id: string;
  timestamp: string;
  event: 'heartbeat' | 'ignition_on' | 'ignition_off' | 'movement' | 'tamper' | 'low_battery';
  speed: number;
  eventLabel: string;
}
```

| Campo                  | Tipo                    | Descricao                                      |
|------------------------|-------------------------|-------------------------------------------------|
| `deviceId`             | `string`                | Identificador unico do dispositivo              |
| `status`               | `string`                | Estado atual: `ativo`, `inativo` ou `alerta`    |
| `batteryLevel`         | `number`                | Nivel de bateria (0-100)                        |
| `signalStrength`       | `string`                | Forca do sinal: `forte`, `moderado`, `fraco`    |
| `location`             | `object`                | Localizacao atual do dispositivo                |
| `lastTransmission`     | `string`                | ISO timestamp da ultima transmissao             |
| `installedAt`          | `string`                | ISO timestamp da instalacao                     |
| `firmwareVersion`      | `string`                | Versao do firmware                              |
| `transmissionHistory`  | `TransmissionEvent[]`   | Historico de eventos de transmissao             |

---

### 4. Consultar historico de casos

```
GET /api/process/history
```

#### Response

`200 OK` retorna um array de `HistoricalCase`.

```typescript
interface HistoricalCase {
  id: string;
  code: string;
  plate: string;
  vehicle: string;
  status: 'finalizado';
  createdAt: string;
  finishedAt: string;
  seizureReason: string;
}
```

| Campo           | Tipo     | Descricao                                |
|-----------------|----------|------------------------------------------|
| `id`            | `string` | Identificador unico do caso              |
| `code`          | `string` | Codigo do caso                           |
| `plate`         | `string` | Placa do veiculo                         |
| `vehicle`       | `string` | Descricao do veiculo (modelo/marca)      |
| `status`        | `string` | Sempre `'finalizado'`                    |
| `createdAt`     | `string` | Data de criacao do caso                  |
| `finishedAt`    | `string` | Data de finalizacao                      |
| `seizureReason` | `string` | Motivo da apreensao                      |

---

## Interfaces compartilhadas

### CaseData

Objeto principal que representa um caso ativo.

```typescript
interface CaseData {
  id: string;
  code: string;
  plate: string;
  vehicle: string;
  vehicleColor: string;
  status: CaseStatus;
  createdAt: string;
  seizureReason: SeizureReason;
  seizureLocation: string;
  vehicleLocation: VehicleLocation;
  address: string;
  timeRemainingMinutes?: number;
  pendencies: Pendency[];
  timeline: TimelineEvent[];
  notifications: Notification[];
  terms: Term[];
  appointment?: Appointment;
}
```

### CaseStatus

```typescript
type CaseStatus =
  | 'em_deslocamento'
  | 'custodia_domiciliar'
  | 'pendencias_regularizar'
  | 'aguardando_validacao'
  | 'apto_retirada'
  | 'aguardando_retirada'
  | 'finalizado';
```

| Status                    | Descricao                                          |
|---------------------------|----------------------------------------------------|
| `em_deslocamento`         | Veiculo em deslocamento para a residencia          |
| `custodia_domiciliar`     | Veiculo em custodia domiciliar                     |
| `pendencias_regularizar`  | Pendencias a regularizar                           |
| `aguardando_validacao`    | Aguardando validacao dos documentos                |
| `apto_retirada`           | Apto para agendar retirada do dispositivo          |
| `aguardando_retirada`     | Aguardando retirada agendada do dispositivo        |
| `finalizado`              | Caso encerrado                                     |

### SeizureReason

```typescript
interface SeizureReason {
  code: string;
  description: string;
  legalBasis: string;
}
```

### VehicleLocation

```typescript
interface VehicleLocation {
  type: 'patio' | 'residencia' | 'em_transito';
  label: string;
  address: string;
  lat: number;
  lng: number;
}
```

### Pendency

```typescript
type PendencyStatus = 'pendente' | 'enviado' | 'em_analise' | 'aprovado' | 'reprovado';

interface Pendency {
  id: string;
  name: string;
  description: string;
  value?: number;
  status: PendencyStatus;
  uploadedFile?: string;
  rejectionReason?: string;
}
```

| Status       | Descricao                                |
|--------------|------------------------------------------|
| `pendente`   | Pendencia aguardando acao do cidadao     |
| `enviado`    | Comprovante enviado pelo cidadao         |
| `em_analise` | Comprovante em analise                   |
| `aprovado`   | Pendencia aprovada                       |
| `reprovado`  | Comprovante recusado (requer reenvio)    |

### TimelineEvent

```typescript
type TimelineEventType = 'info' | 'success' | 'warning' | 'error';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: TimelineEventType;
  completed: boolean;
  link?: string;
  linkLabel?: string;
}
```

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

---

## Gerenciamento de estado (CaseContext)

### CaseContextType

```typescript
interface CaseContextType {
  activeCases: CaseData[];
  currentCase: CaseData | null;
  selectedCaseId: string | null;
  selectCase: (id: string) => void;
  updateCase: (id: string, data: Partial<CaseData>) => void;
}
```

### Actions do reducer

```typescript
type CaseAction =
  | { type: 'SET_CASES'; payload: CaseData[] }
  | { type: 'SELECT_CASE'; payload: string }
  | { type: 'UPDATE_CASE'; payload: { id: string; data: Partial<CaseData> } }
  | { type: 'CLEAR' };
```

### Persistencia

| Chave          | Storage          | Descricao                              |
|----------------|------------------|----------------------------------------|
| `pv-cases-v1`  | session ou local | Estado completo dos casos (JSON)       |

O estado e limpo automaticamente no logout (ao detectar `isAuthenticated: false`).

---

## Rotas do modulo

| Rota                                              | Pagina              | Descricao                                     |
|---------------------------------------------------|----------------------|------------------------------------------------|
| `/app/process`                                    | ProcessListPage      | Lista de casos ativos                          |
| `/app/process/:id`                                | ProcessDetailPage    | Detalhes de um caso                            |
| `/app/process/:id/timeline`                       | ProcessTimelinePage  | Timeline de eventos do caso                    |
| `/app/process/:id/pendencias`                     | PendenciesPage       | Lista de pendencias do caso                    |
| `/app/process/:id/pendencias/:pendencyId/upload`  | UploadPage           | Upload de comprovante de pendencia             |
| `/app/process/:id/pendencias/:pendencyId/pagamento` | PaymentPage       | Pagamento de pendencia (PIX ou boleto)         |
| `/app/gps`                                        | GPSStatusPage        | Status do dispositivo GPS                      |
| `/app/historico`                                   | HistoryPage          | Historico de casos finalizados                 |

Todas as rotas sao protegidas por `<RequireAuth />` e renderizadas dentro de `<AppLayout />`.

---

## Fluxo de pagamento

```
PendenciesPage
  |
  PendencyCard (botao "Pagar")
  |
  navigate(/app/process/{id}/pendencias/{pendencyId}/pagamento)
  |
PaymentPage
  |
  Selecionar metodo: PIX ou Boleto
  |
  [PIX]
    |
    Exibir QR code + codigo PIX copiavel
    |
    Confirmar pagamento
    |
    POST /api/process/{id}/pendencies/{pendencyId}/payment
    |
    updateCase() com pendencias atualizadas
  |
  [Boleto]
    |
    Gerar boleto (link externo)
```

## Fluxo de upload

```
PendenciesPage
  |
  PendencyCard (botao "Enviar comprovante")
  |
  navigate(/app/process/{id}/pendencias/{pendencyId}/upload)
  |
UploadPage
  |
  Selecionar arquivo (imagem ou PDF)
  |
  Preview (imagem) ou info do arquivo (PDF)
  |
  POST /api/process/{id}/pendencies/{pendencyId}/upload
  |
  updateCase() com pendencias atualizadas
  |
  Tela de sucesso
```

---

## Estrutura de arquivos

```
src/modules/process/
  index.ts                          Barrel exports
  types/
    case-context.ts                 CaseAction, CaseState
  store/
    case-store.ts                   Reducer, persistencia, loadPersistedCases
  contexts/
    CaseContext.tsx                  CaseProvider, useCases, useCaseDispatch
  services/
    pendency.service.ts             submitPendencyFile, confirmPendencyPayment
    gps.service.ts                  getGpsStatusByCase
    history.service.ts              getHistoricalCases
  components/
    TimelineItem.tsx                Item individual da timeline
    PendencyCard.tsx                Card de pendencia com acoes
  pages/
    ProcessListPage.tsx             Lista de casos ativos
    ProcessDetailPage.tsx           Detalhes do caso com navegacao
    ProcessTimelinePage.tsx         Timeline com barra de progresso
    PendenciesPage.tsx              Lista de pendencias
    UploadPage.tsx                  Upload de comprovante
    PaymentPage.tsx                 Pagamento via PIX ou boleto
    GPSStatusPage.tsx               Status do dispositivo GPS
    HistoryPage.tsx                 Historico de casos finalizados
```

---

## Exports publicos (barrel)

```typescript
export { default as ProcessListPage } from './pages/ProcessListPage';
export { default as ProcessDetailPage } from './pages/ProcessDetailPage';
export { default as ProcessTimelinePage } from './pages/ProcessTimelinePage';
export { default as GPSStatusPage } from './pages/GPSStatusPage';
export { default as HistoryPage } from './pages/HistoryPage';
export { TimelineItem } from './components/TimelineItem';
export { CaseProvider, useCases, useCaseDispatch } from './contexts/CaseContext';
```

---

## Validacao de formularios (frontend)

### Upload de comprovante

| Campo | Regras                                   |
|-------|------------------------------------------|
| file  | Obrigatorio, aceita `image/*` e `.pdf`   |

### Pagamento PIX

Nenhum campo de input. A confirmacao e feita via botao apos visualizar o QR code.

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `process.*`, `pendency.*`, `payment.*`, `upload.*`, `gps.*`, `history.*`, `timeline.*`, `common.*`.
