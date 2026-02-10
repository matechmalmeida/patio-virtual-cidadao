# Dashboard Module - API Contract

Contrato da API para o modulo de dashboard do Patio Virtual.

O dashboard e a pagina principal do cidadao apos login. Exibe um resumo do caso ativo, progresso do processo, pendencias, documentos pendentes e notificacoes.

Este modulo nao possui endpoints proprios. Consome dados dos modulos `process` (CaseContext) e `notification` (useNotifications).

---

## Dados consumidos

### CaseData (do CaseContext)

O dashboard utiliza todos os campos de `CaseData` para renderizar o resumo:

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

### Metricas exibidas

| Metrica                  | Calculo                                                | Variante |
|--------------------------|--------------------------------------------------------|----------|
| Pendencias resolvidas    | `pendencies.filter(p => p.status === 'aprovado').length / total` | warning  |
| Documentos a assinar     | `terms.filter(t => t.status === 'pendente').length`    | info     |
| Notificacoes nao lidas   | `unreadCount` do `useNotifications()`                  | muted    |

---

## Workflow de status no stepper

O `ProcessStepper` exibe 7 etapas correspondendo a cada `CaseStatus`:

| Etapa | Status                    | Icone          | Descricao                    |
|-------|---------------------------|----------------|------------------------------|
| 1     | `em_deslocamento`         | Navigation     | Em deslocamento              |
| 2     | `custodia_domiciliar`     | Home           | Custodia domiciliar          |
| 3     | `pendencias_regularizar`  | FileWarning    | Pendencias a regularizar     |
| 4     | `aguardando_validacao`    | Clock          | Aguardando validacao         |
| 5     | `apto_retirada`           | CheckCircle2   | Apto para retirada           |
| 6     | `aguardando_retirada`     | CalendarDays   | Aguardando retirada          |
| 7     | `finalizado`              | Flag           | Finalizado                   |

Etapas concluidas exibem checkmark verde. A etapa atual tem destaque com cor primaria e ring.

---

## Renderizacao condicional por status

O dashboard exibe diferentes cards de acao conforme o status do caso:

| Status                                          | Card exibido                                    |
|-------------------------------------------------|-------------------------------------------------|
| `pendencias_regularizar` ou `custodia_domiciliar` | Pendencias a resolver com link                |
| `apto_retirada`                                 | Botao "Agendar retirada"                        |
| `aguardando_validacao`                          | Mensagem de aguardando validacao                |
| `aguardando_retirada`                           | Detalhes do agendamento confirmado              |
| `finalizado`                                    | Mensagem de veiculo liberado                    |

---

## Onboarding tutorial

Na primeira visita, o dashboard exibe um modal de onboarding com 4 etapas:

| Etapa | Icone         | Cor     | Descricao                    |
|-------|---------------|---------|-------------------------------|
| 1     | Car           | primary | Apresentacao do sistema       |
| 2     | Satellite     | warning | Sobre o dispositivo GPS       |
| 3     | FileCheck     | success | Como resolver pendencias      |
| 4     | CalendarCheck | info    | Como agendar retirada         |

**Persistencia:** `pv_onboarding_completed` no `localStorage`.

O tutorial pode ser pulado (Skip) ou concluido (Start). Uma vez concluido, nao aparece novamente.

---

## Rotas do modulo

| Rota              | Pagina        | Descricao                         |
|-------------------|---------------|-----------------------------------|
| `/app/dashboard`  | DashboardPage | Pagina principal do cidadao       |

A rota e protegida por `<RequireAuth />` e renderizada dentro de `<AppLayout />`.

---

## Links de navegacao gerados pelo dashboard

| Destino                                | Condicao                                |
|----------------------------------------|-----------------------------------------|
| `/app/process/{caseId}/pendencias`     | Quando ha pendencias a resolver         |
| `/app/documentos`                      | Quando ha documentos pendentes          |
| `/app/notifications`                   | Sempre                                  |
| `/app/agendamento`                     | Quando status e `apto_retirada`         |
| `/app/documentos/{termId}`             | Para cada termo pendente                |

---

## Estrutura de arquivos

```
src/modules/dashboard/
  index.ts                              Barrel exports
  hooks/
    useOnboarding.ts                    Gerencia estado do onboarding (localStorage)
  components/
    OnboardingTutorial.tsx              Modal tutorial de 4 etapas
    PendenciesOverview.tsx              Card de progresso de pendencias
    ProcessStepper.tsx                  Stepper horizontal de status do processo
    SummaryStatCard.tsx                 Card de metrica com icone e variante
  pages/
    DashboardPage.tsx                   Pagina principal do dashboard
```

---

## Exports publicos (barrel)

```typescript
export { default as DashboardPage } from './pages/DashboardPage';
```

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `dashboard.*`, `onboarding.*`, `pendency.*`, `common.*`.
