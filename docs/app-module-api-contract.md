# App Module - API Contract

Contrato da API para o modulo de layout/aplicacao do Patio Virtual.

Este modulo e responsavel pelo shell da aplicacao: layout responsivo (sidebar desktop + bottom nav mobile), header, instalacao PWA e pagina 404. Nao possui endpoints de API.

---

## Layout responsivo

O `AppLayout` detecta o breakpoint e renderiza layouts diferentes:

| Viewport       | Breakpoint | Layout                                      |
|---------------|------------|----------------------------------------------|
| Mobile         | < 1024px   | AppHeader + content + BottomNav (fixo)       |
| Desktop        | >= 1024px  | AppSidebar + AppHeader (com toggle) + content |

### Breakpoint

```typescript
const DESKTOP_BREAKPOINT = 1024; // px
```

Detectado via `matchMedia` API no hook `useIsDesktop()`.

---

## Navegacao

### Itens de navegacao

Configurados em `src/modules/app/lib/nav-items.ts`, compartilhados entre `BottomNav` e `AppSidebar`:

```typescript
interface NavItem {
  to: string;
  labelKey: string;
  icon: LucideIcon;
}
```

| Rota                | Label (i18n key) | Icone         |
|---------------------|-------------------|---------------|
| `/app/dashboard`    | `nav.process`     | Home          |
| `/app/documentos`   | `nav.documents`   | ScrollText    |
| `/app/process`      | `nav.processes`   | ClipboardList |
| `/app/notifications`| `nav.alerts`      | Bell          |
| `/app/profile`      | `nav.profile`     | User          |

Ambos os componentes de navegacao exibem badge de notificacoes no item de alertas.

---

## Componentes

### AppLayout

Wrapper principal de todas as rotas protegidas. Renderiza `<Outlet />` para rotas filhas.

**Estado persistido:**

| Chave                 | Storage        | Descricao                        |
|-----------------------|----------------|----------------------------------|
| `pv-sidebar-collapsed`| `localStorage` | Estado colapsado da sidebar      |

---

### AppHeader

Header exibido em todas as paginas protegidas.

**Funcionalidades:**
- Logo/branding (via BrandContext)
- Botao de toggle da sidebar (somente desktop)
- Indicador de status de conexao (WiFi)
- Botao de notificacoes com badge de contagem
- Language switcher
- Avatar do usuario com dropdown menu (logout, tema, info)

**Avatar:** Carregado de `localStorage` com chave `pv-avatar`.

---

### AppSidebar

Sidebar lateral exibida somente no desktop.

**Funcionalidades:**
- Logo e nome do app
- Navegacao com NavLink (5 itens)
- Tooltips quando colapsada
- Badge de notificacoes
- Versao do app no rodape (`__APP_VERSION__`)
- CSS variables: `bg-sidebar`, `text-sidebar-foreground`

---

### BottomNav

Barra de navegacao fixa no rodape (somente mobile).

**Funcionalidades:**
- 5 itens de navegacao com icones e labels
- Estado ativo com cor primaria
- Badge de notificacoes
- Safe area padding para dispositivos com notch

---

## Hooks

### useIsDesktop

```typescript
function useIsDesktop(): boolean
```

Retorna `true` quando viewport >= 1024px. Utiliza `matchMedia` API.

---

### usePWAInstall

```typescript
function usePWAInstall(): {
  canInstall: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  install: () => Promise<boolean>;
}
```

| Campo        | Tipo                    | Descricao                                   |
|--------------|-------------------------|----------------------------------------------|
| `canInstall` | `boolean`               | Prompt de instalacao disponivel e nao instalado |
| `isInstalled`| `boolean`               | App ja instalado como PWA                    |
| `isIOS`      | `boolean`               | Dispositivo e iOS (instrucoes manuais)       |
| `install`    | `() => Promise<boolean>`| Dispara prompt de instalacao (retorna se aceito)|

**Deteccao de PWA instalada:**
- `matchMedia('(display-mode: standalone)')`
- `navigator.standalone` (Safari)

**Deteccao iOS:** User Agent com `iPad|iPhone|iPod`.

---

## Paginas

### InstallPage

**Rota:** `/instalar` (publica, fora do layout protegido)

Pagina de instrucoes para instalacao do PWA.

**Comportamento condicional:**
- **Ja instalado:** Exibe card de sucesso
- **Pode instalar (Android):** Botao de instalacao nativa
- **iOS:** Instrucoes passo a passo (Share > Add to Home Screen > Add)
- **Outros:** Mensagem generica

**Beneficios exibidos:** Acesso rapido, Modo offline, Notificacoes, Tela cheia.

---

### NotFound (404)

**Rota:** `*` (catch-all)

Exibe mensagem 404 com link para voltar ao inicio. Loga aviso via `logger.warn`.

---

## Rotas do modulo

| Rota        | Pagina      | Acesso  | Descricao                          |
|-------------|-------------|---------|-------------------------------------|
| `/instalar` | InstallPage | Publico | Instrucoes de instalacao PWA       |
| `*`         | NotFound    | Publico | Pagina 404                         |

---

## Estrutura de arquivos

```
src/modules/app/
  index.ts                          Barrel exports
  lib/
    nav-items.ts                    Configuracao dos itens de navegacao
  hooks/
    useIsDesktop.ts                 Deteccao de viewport desktop
    usePWAInstall.ts                Gerenciamento de instalacao PWA
  components/
    AppLayout.tsx                   Layout principal (sidebar/header/bottom nav)
    AppHeader.tsx                   Header com branding, notificacoes, menu
    AppSidebar.tsx                  Sidebar desktop com navegacao colapsavel
    BottomNav.tsx                   Navegacao mobile fixa no rodape
  pages/
    InstallPage.tsx                 Pagina de instalacao PWA
    NotFound.tsx                    Pagina 404
```

---

## Exports publicos (barrel)

```typescript
export { AppLayout } from './components/AppLayout';
export { usePWAInstall } from './hooks/usePWAInstall';
```

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `nav.*`, `install.*`, `notFound.*`, `app.*`.
