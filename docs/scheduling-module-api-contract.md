# Scheduling Module - API Contract

Contrato da API para o modulo de agendamento do Patio Virtual.

O frontend permite ao cidadao agendar a retirada do dispositivo GPS em um ponto autorizado apos resolver todas as pendencias do caso.

---

## Endpoints

### 1. Listar pontos de retirada

```
GET /api/schedule/locations
```

#### Response

`200 OK` retorna um array de `ScheduleLocation`.

```typescript
interface ScheduleLocation {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}
```

| Campo     | Tipo      | Descricao                                     |
|-----------|-----------|------------------------------------------------|
| `id`      | `string`  | Identificador unico do ponto                  |
| `name`    | `string`  | Nome do ponto de retirada                      |
| `address` | `string`  | Endereco completo                              |
| `lat`     | `number?` | Latitude (para Google Maps)                    |
| `lng`     | `number?` | Longitude (para Google Maps)                   |

#### Dados de teste (mock)

| ID      | Nome            | Endereco                                | Coordenadas            |
|---------|-----------------|-----------------------------------------|------------------------|
| `loc_1` | Posto Aldeota   | Av. Santos Dumont, 1500 - Aldeota       | -3.7327, -38.5091     |
| `loc_2` | Posto Messejana | Av. Frei Cirilo, 800 - Messejana        | -3.8127, -38.4891     |
| `loc_3` | Posto Centro    | Rua Guilherme Rocha, 300 - Centro       | -3.7227, -38.5291     |

---

### 2. Listar horarios disponiveis

```
GET /api/schedule/slots
```

#### Response

`200 OK` retorna um array de `ScheduleSlot`.

```typescript
interface ScheduleSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
  recommended?: boolean;
}
```

| Campo         | Tipo       | Descricao                                          |
|---------------|-----------|-----------------------------------------------------|
| `id`          | `string`  | Identificador unico do slot                         |
| `date`        | `string`  | Data no formato `YYYY-MM-DD`                        |
| `time`        | `string`  | Horario no formato `HH:MM`                          |
| `available`   | `boolean` | Se o horario esta disponivel para agendamento       |
| `recommended` | `boolean?`| Flag opcional indicando horario recomendado (estrela)|

#### Dados de teste (mock)

12 slots distribuidos em 3 datas:

| Data       | Horarios                                     | Indisponiveis |
|------------|----------------------------------------------|---------------|
| 2026-02-12 | 08:00, 09:00, 10:00, 11:00, 14:00, 15:00   | 10:00         |
| 2026-02-13 | 08:00, 09:00, 10:00, 14:00                  | 09:00         |
| 2026-02-14 | 08:00, 09:00                                 | -             |

Slots marcados com `recommended: true` exibem icone de estrela no frontend.

---

### 3. Criar agendamento

```
POST /api/schedule/appointments
```

#### Request Body

```typescript
{
  caseId: string;
  locationId: string;
  slotId: string;
}
```

| Campo        | Tipo     | Obrigatorio | Descricao                              |
|--------------|----------|-------------|----------------------------------------|
| `caseId`     | `string` | Sim         | ID do caso ativo                       |
| `locationId` | `string` | Sim         | ID do ponto de retirada selecionado    |
| `slotId`     | `string` | Sim         | ID do slot de horario selecionado      |

#### Response

`200 OK` retorna um objeto com o agendamento criado e o novo status do caso.

```typescript
{
  appointment: Appointment;
  status: CaseStatus;
}
```

```typescript
interface Appointment {
  id: string;
  code: string;
  location: ScheduleLocation;
  date: string;
  time: string;
}
```

| Campo                | Tipo               | Descricao                                        |
|----------------------|--------------------|--------------------------------------------------|
| `appointment.id`     | `string`           | ID do agendamento (formato `apt_{timestamp}`)    |
| `appointment.code`   | `string`           | Codigo do agendamento (formato `AGD-XXXXXX`)     |
| `appointment.location` | `ScheduleLocation` | Dados do ponto de retirada                     |
| `appointment.date`   | `string`           | Data formatada                                   |
| `appointment.time`   | `string`           | Horario no formato `HH:MM`                       |
| `status`             | `CaseStatus`       | Novo status do caso: `'aguardando_retirada'`     |

#### Erros

| Status | Codigo      | Condicao            | userMessage                |
|--------|-------------|---------------------|----------------------------|
| 404    | `NOT_FOUND` | Caso nao encontrado | `Caso nao encontrado.`    |

---

## Pre-condicao para agendamento

O agendamento so e permitido quando o caso tem `status === 'apto_retirada'`. Se o caso nao atende essa condicao, o frontend exibe uma mensagem informando as pendencias que precisam ser resolvidas.

Apos o agendamento, o status do caso muda para `'aguardando_retirada'`.

---

## Rotas do modulo

| Rota                          | Pagina                      | Descricao                                 |
|-------------------------------|-----------------------------|--------------------------------------------|
| `/app/agendamento`            | SchedulingPage              | Wizard de agendamento (local + data/hora) |
| `/app/agendamento/confirmacao`| SchedulingConfirmationPage  | Confirmacao do agendamento                |

Todas as rotas sao protegidas por `<RequireAuth />` e renderizadas dentro de `<AppLayout />`.

---

## Fluxo de agendamento

```
SchedulingPage (Step 1: Selecao de local)
  |
  GET /api/schedule/locations
  |
  Usuario seleciona ponto de retirada
  |
SchedulingPage (Step 2: Selecao de data e horario)
  |
  GET /api/schedule/slots
  |
  Usuario seleciona data no calendario
  |
  Slots filtrados pela data selecionada
  |
  Usuario seleciona horario
  |
  POST /api/schedule/appointments
  |
  updateCase() com appointment e status atualizados
  |
  navigate(/app/agendamento/confirmacao)
  |
SchedulingConfirmationPage
  |
  Exibe: codigo do agendamento, local, data, horario
  |
  Botao "Ver rota" (abre Google Maps directions)
  |
  Botao "Voltar para inicio"
```

---

## Frontend: React Query

```
queryKeys.schedule.locations() → ['schedule', 'locations']
queryKeys.schedule.slots()     → ['schedule', 'slots']
```

---

## Estrutura de arquivos

```
src/modules/scheduling/
  index.ts                                  Barrel exports
  services/
    schedule.service.ts                     getScheduleLocations, getScheduleSlots
    case.service.ts                         createAppointment
  pages/
    SchedulingPage.tsx                      Wizard de agendamento (2 etapas)
    SchedulingConfirmationPage.tsx          Pagina de confirmacao
```

---

## Exports publicos (barrel)

```typescript
export { default as SchedulingPage } from './pages/SchedulingPage';
export { default as SchedulingConfirmationPage } from './pages/SchedulingConfirmationPage';
```

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `scheduling.*`, `schedulingConfirmation.*`, `common.*`.
