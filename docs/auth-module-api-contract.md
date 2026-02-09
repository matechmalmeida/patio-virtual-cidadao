# Auth Module - API Contract

Contrato da API para o modulo de autenticacao do Patio Virtual.

O frontend consome endpoints de autenticacao para login (email+senha), magic link, TOTP/2FA, recuperacao de senha e gerenciamento de 2FA.

---

## Usuarios de teste (mock)

| Email               | Senha    | 2FA     | Nome          | ID      |
|----------------------|----------|---------|---------------|---------|
| `cidadao@email.com`  | `123456` | Nao     | Joao Silva    | `usr_1` |
| `2fa@email.com`      | `123456` | Sim     | Maria Santos  | `usr_2` |
| Qualquer outro email | `123456` | Nao     | (parte local) | Gerado  |

Tokens de teste para fluxos com token na URL:

| Fluxo          | Token valido          | Regra de validacao              |
|----------------|-----------------------|---------------------------------|
| Magic link     | `magic_valid_token`   | Qualquer token com prefixo `magic_` |
| Reset de senha | `reset_valid_token`   | Qualquer token com prefixo `reset_` |
| TOTP           | `000000`              | Codigo fixo de 6 digitos        |

---

## Endpoints

### 1. Login

```
POST /api/auth/login
```

#### Request Body

```typescript
{
  email: string;
  password: string;
}
```

| Campo      | Tipo     | Obrigatorio | Descricao                      |
|------------|----------|-------------|--------------------------------|
| `email`    | `string` | Sim         | Email do usuario (normalizado para lowercase + trim) |
| `password` | `string` | Sim         | Senha do usuario               |

#### Response

`200 OK` retorna um objeto `LoginResult`.

```typescript
interface LoginResult {
  requiresTotp: boolean;
  tempToken: string | null;
  session: VerifiedSession | null;
}
```

| Campo          | Tipo               | Descricao                                                   |
|----------------|--------------------|-------------------------------------------------------------|
| `requiresTotp` | `boolean`          | `true` se o usuario tem 2FA habilitado e precisa verificar  |
| `tempToken`    | `string \| null`   | Token temporario para completar a verificacao TOTP. `null` se 2FA nao e necessario |
| `session`      | `VerifiedSession \| null` | Sessao autenticada. `null` se 2FA e necessario       |

#### Cenarios

| Cenario                    | `requiresTotp` | `tempToken`        | `session`        |
|----------------------------|----------------|--------------------|--------------------|
| Login sem 2FA              | `false`        | `null`             | `VerifiedSession`  |
| Login com 2FA habilitado   | `true`         | `totp_{userId}_{timestamp}` | `null`  |

#### Erros

| Status | Codigo       | Condicao                  | userMessage                    |
|--------|-------------|---------------------------|--------------------------------|
| 400    | `VALIDATION` | Email em formato invalido | `Formato de email invalido.`   |
| 401    | `UNAUTHORIZED` | Credenciais incorretas  | `Email ou senha incorretos.`   |

---

### 2. Verificar TOTP

```
POST /api/auth/totp/verify
```

#### Request Body

```typescript
{
  tempToken: string;
  code: string;
}
```

| Campo       | Tipo     | Obrigatorio | Descricao                                |
|-------------|----------|-------------|------------------------------------------|
| `tempToken` | `string` | Sim         | Token temporario obtido no login         |
| `code`      | `string` | Sim         | Codigo de 6 digitos do app autenticador  |

#### Response

`200 OK` retorna um objeto `VerifiedSession`.

#### Erros

| Status | Codigo        | Condicao                  | userMessage                                 |
|--------|--------------|---------------------------|---------------------------------------------|
| 400    | `VALIDATION`  | Codigo TOTP incorreto     | `Codigo incorreto.`                         |
| 401    | `UNAUTHORIZED`| Token temporario invalido | `Sessao expirada. Faca login novamente.`    |

---

### 3. Solicitar reset de senha

```
POST /api/auth/password/reset-request
```

#### Request Body

```typescript
{
  email: string;
}
```

| Campo   | Tipo     | Obrigatorio | Descricao               |
|---------|----------|-------------|-------------------------|
| `email` | `string` | Sim         | Email cadastrado        |

#### Response

`200 OK` retorna confirmacao. O backend sempre retorna sucesso independentemente de o email existir ou nao (prevencao de enumeracao de contas).

```typescript
{
  message: string;
}
```

---

### 4. Redefinir senha

```
POST /api/auth/password/reset
```

#### Request Body

```typescript
{
  token: string;
  password: string;
}
```

| Campo      | Tipo     | Obrigatorio | Descricao                                     |
|------------|----------|-------------|-----------------------------------------------|
| `token`    | `string` | Sim         | Token de reset recebido por email             |
| `password` | `string` | Sim         | Nova senha (min. 8 chars, 1 maiuscula, 1 numero) |

#### Response

`200 OK` retorna confirmacao.

```typescript
{
  message: string;
}
```

#### Erros

| Status | Codigo       | Condicao                        | userMessage                                 |
|--------|--------------|---------------------------------|---------------------------------------------|
| 400    | `VALIDATION` | Token invalido ou expirado      | `Link expirado ou invalido.`                |
| 400    | `VALIDATION` | Senha fraca (menos de 8 chars)  | `A senha deve ter no minimo 8 caracteres.`  |

---

### 5. Solicitar magic link

```
POST /api/auth/magic-link/request
```

#### Request Body

```typescript
{
  email: string;
}
```

| Campo   | Tipo     | Obrigatorio | Descricao               |
|---------|----------|-------------|-------------------------|
| `email` | `string` | Sim         | Email cadastrado        |

#### Response

`200 OK` retorna confirmacao. Mesmo comportamento do reset: sempre sucesso para prevenir enumeracao.

```typescript
{
  message: string;
}
```

---

### 6. Verificar magic link

```
POST /api/auth/magic-link/verify
```

#### Request Body

```typescript
{
  token: string;
}
```

| Campo   | Tipo     | Obrigatorio | Descricao                           |
|---------|----------|-------------|-------------------------------------|
| `token` | `string` | Sim         | Token recebido na URL do magic link |

#### Response

`200 OK` retorna um objeto `VerifiedSession`.

#### Erros

| Status | Codigo       | Condicao                   | userMessage                     |
|--------|-------------|----------------------------|---------------------------------|
| 400    | `VALIDATION` | Token invalido ou expirado | `Link invalido ou expirado.`    |

---

### 7. Configurar TOTP (ativar 2FA)

```
POST /api/auth/totp/setup
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Response

`200 OK` retorna os dados para configuracao do app autenticador.

```typescript
interface TotpSetupData {
  secret: string;
  qrCodeUrl: string;
}
```

| Campo      | Tipo     | Descricao                                                     |
|------------|----------|---------------------------------------------------------------|
| `secret`   | `string` | Chave secreta TOTP (base32) para entrada manual               |
| `qrCodeUrl`| `string` | URI `otpauth://` para gerar QR code no frontend               |

---

### 8. Confirmar configuracao TOTP

```
POST /api/auth/totp/confirm
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Request Body

```typescript
{
  code: string;
}
```

| Campo  | Tipo     | Obrigatorio | Descricao                               |
|--------|----------|-------------|-----------------------------------------|
| `code` | `string` | Sim         | Codigo de 6 digitos para confirmar setup |

#### Response

`200 OK` retorna confirmacao.

```typescript
{
  message: string;
}
```

#### Erros

| Status | Codigo       | Condicao              | userMessage            |
|--------|--------------|-----------------------|------------------------|
| 400    | `VALIDATION` | Codigo TOTP incorreto | `Codigo incorreto.`    |

---

### 9. Desativar TOTP

```
POST /api/auth/totp/disable
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Request Body

```typescript
{
  code: string;
}
```

| Campo  | Tipo     | Obrigatorio | Descricao                                  |
|--------|----------|-------------|---------------------------------------------|
| `code` | `string` | Sim         | Codigo de 6 digitos para confirmar desativacao |

#### Response

`200 OK` retorna confirmacao.

```typescript
{
  message: string;
}
```

#### Erros

| Status | Codigo       | Condicao              | userMessage            |
|--------|--------------|-----------------------|------------------------|
| 400    | `VALIDATION` | Codigo TOTP incorreto | `Codigo incorreto.`    |

---

## Interfaces compartilhadas

### VerifiedSession

Objeto retornado apos autenticacao bem-sucedida (login direto, TOTP ou magic link).

```typescript
interface VerifiedSession {
  token: string;
  user: AuthUser;
  activeCases: CaseData[];
}
```

| Campo         | Tipo         | Descricao                                     |
|---------------|-------------|------------------------------------------------|
| `token`       | `string`    | Token de sessao (UUID v4). Usado como Bearer token |
| `user`        | `AuthUser`  | Dados do usuario autenticado                   |
| `activeCases` | `CaseData[]`| Casos ativos vinculados ao usuario             |

### AuthUser

```typescript
interface AuthUser {
  id: string;
  email: string;
  name: string;
  totpEnabled: boolean;
}
```

| Campo         | Tipo      | Descricao                                    |
|---------------|-----------|----------------------------------------------|
| `id`          | `string`  | Identificador unico do usuario               |
| `email`       | `string`  | Email do usuario (lowercase)                 |
| `name`        | `string`  | Nome de exibicao                             |
| `totpEnabled` | `boolean` | `true` se 2FA esta habilitado na conta       |

---

## Codigos de erro da API

O frontend utiliza a classe `ApiError` para padronizar erros. Todos os endpoints devem retornar erros no seguinte formato:

```typescript
interface ApiErrorResponse {
  code: ApiErrorCode;
  message: string;
}
```

```typescript
type ApiErrorCode =
  | 'TIMEOUT'
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'SERVER'
  | 'UNKNOWN';
```

| Codigo         | HTTP Status | Descricao                              |
|----------------|-------------|----------------------------------------|
| `VALIDATION`   | 400         | Dados invalidos ou regras de negocio   |
| `UNAUTHORIZED` | 401         | Credenciais invalidas ou sessao expirada |
| `FORBIDDEN`    | 403         | Sem permissao para a acao              |
| `NOT_FOUND`    | 404         | Recurso nao encontrado                 |
| `SERVER`       | 5xx         | Erro interno do servidor               |

---

## Autenticacao e sessao

### Token

- Tipo: UUID v4
- Transporte: header `Authorization: Bearer {token}`
- Duracao: 8 horas (gerenciado no frontend via `expiresAt`)

### Persistencia no frontend

| Modo               | Storage          | Comportamento                              |
|--------------------|------------------|---------------------------------------------|
| Padrao             | `sessionStorage` | Sessao perdida ao fechar o navegador        |
| "Lembrar-me" ativo | `localStorage`   | Sessao persiste entre fechamentos do browser |

Chaves utilizadas:

| Chave            | Storage         | Descricao                              |
|------------------|-----------------|----------------------------------------|
| `pv-session-v2`  | session ou local | Estado completo da sessao (JSON)      |
| `pv-remember`    | `localStorage`  | Flag "lembrar-me" (`"true"` ou ausente)|

### Estado da sessao (SessionState)

```typescript
interface SessionState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  sessionToken: string | null;
  totpPending: boolean;
  totpTempToken: string | null;
  totpEmail: string | null;
  activeCases: CaseData[];
  selectedCaseId: string | null;
  expiresAt: number | null;
}
```

### Actions do reducer

```typescript
type SessionAction =
  | { type: 'LOGIN_SUCCESS'; payload: VerifiedSession }
  | { type: 'TOTP_PENDING'; payload: { tempToken: string; email: string } }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_CASE'; payload: string }
  | { type: 'UPDATE_CASE'; payload: { id: string; data: Partial<CaseData> } };
```

---

## Cliente HTTP

O modulo configura automaticamente o cliente HTTP (`src/services/http/http-client.ts`) com:

- Injecao de `Authorization: Bearer {token}` em todas as requisicoes
- Interceptacao de `401 Unauthorized` com logout automatico
- Interceptacao de `403 Forbidden` com feedback ao usuario
- Retry e timeout via `requestWithPolicy` (timeout: 8s, 1 retry, delay: 350ms)

A configuracao e feita no `AuthProvider` e atualizada sempre que o `sessionToken` muda.

---

## Validacao de formularios (frontend)

### Login

| Campo    | Regras                     |
|----------|----------------------------|
| email    | Obrigatorio, formato email |
| password | Obrigatorio, min. 6 chars  |

### Reset de senha

| Campo           | Regras                                                     |
|-----------------|-------------------------------------------------------------|
| password        | Min. 8 chars, pelo menos 1 letra maiuscula, pelo menos 1 numero |
| confirmPassword | Deve ser igual ao campo password                            |

### Magic link / Esqueci senha

| Campo | Regras                     |
|-------|----------------------------|
| email | Obrigatorio, formato email |

### TOTP

| Campo | Regras                        |
|-------|-------------------------------|
| code  | Exatamente 6 digitos numericos |

---

## Indicador de forca de senha

O `ResetPasswordPage` inclui um indicador visual de forca com 5 niveis:

| Pontuacao | Nivel       | Cor            | Criterios acumulados                             |
|-----------|-------------|----------------|-------------------------------------------------|
| 1         | Muito fraca | Vermelho       | >= 8 caracteres                                  |
| 2         | Fraca       | Laranja        | + >= 12 caracteres                               |
| 3         | Razoavel    | Amarelo        | + letras maiusculas e minusculas                 |
| 4         | Forte       | Verde claro    | + pelo menos 1 numero                            |
| 5         | Muito forte | Verde escuro   | + pelo menos 1 caractere especial                |

---

## Rotas do modulo

| Rota                     | Pagina              | Acesso  | Descricao                        |
|--------------------------|----------------------|---------|----------------------------------|
| `/acesso`                | LoginPage            | Publico | Login email+senha                |
| `/acesso/esqueci-senha`  | ForgotPasswordPage   | Publico | Solicitar reset de senha         |
| `/acesso/nova-senha`     | ResetPasswordPage    | Publico | Redefinir senha (requer `?token=`) |
| `/acesso/link-magico`    | MagicLinkRequestPage | Publico | Solicitar magic link             |
| `/acesso/verificar`      | MagicLinkVerifyPage  | Publico | Verificar magic link (requer `?token=`) |
| `/acesso/2fa`            | TotpChallengePage    | Publico | Verificar codigo TOTP            |

---

## Fluxos de autenticacao

### Login padrao (sem 2FA)

```
LoginPage
  |
  POST /api/auth/login
  |
  requiresTotp: false
  |
  dispatch(LOGIN_SUCCESS)
  |
  navigate(/dashboard)
```

### Login com 2FA

```
LoginPage
  |
  POST /api/auth/login
  |
  requiresTotp: true, tempToken: "totp_..."
  |
  dispatch(TOTP_PENDING)
  |
  navigate(/acesso/2fa)
  |
TotpChallengePage
  |
  POST /api/auth/totp/verify
  |
  dispatch(LOGIN_SUCCESS)
  |
  navigate(/dashboard)
```

### Magic link

```
MagicLinkRequestPage
  |
  POST /api/auth/magic-link/request
  |
  Exibe "verifique seu email"
  |
  (usuario clica no link)
  |
MagicLinkVerifyPage (?token=magic_...)
  |
  POST /api/auth/magic-link/verify
  |
  dispatch(LOGIN_SUCCESS)
  |
  navigate(/dashboard)
```

### Recuperacao de senha

```
ForgotPasswordPage
  |
  POST /api/auth/password/reset-request
  |
  Exibe "email enviado"
  |
  (usuario clica no link)
  |
ResetPasswordPage (?token=reset_...)
  |
  POST /api/auth/password/reset
  |
  Exibe "senha alterada"
  |
  Link para /acesso
```

---

## Estrutura de arquivos

```
src/modules/auth/
  index.ts                          Barrel exports
  types/
    auth.ts                         AuthUser, LoginResult, VerifiedSession, TotpSetupData, SessionAction, SessionState
  store/
    session-store.ts                Reducer, persistencia (session/localStorage), remember-me
  contexts/
    AuthContext.tsx                  AuthProvider, useAuth, useAuthDispatch, config do HTTP client
  services/
    auth.service.ts                 Funcoes de API (mock): login, verifyTotp, requestPasswordReset, resetPassword, requestMagicLink, verifyMagicLink, setupTotp, confirmTotpSetup, disableTotp
  components/
    AuthLayout.tsx                  Layout compartilhado (branding, dark mode, language switcher)
    TotpSetupDialog.tsx             Dialog de ativacao/desativacao de 2FA com QR code
    PasswordStrengthBar.tsx         Indicador visual de forca de senha (5 niveis)
  pages/
    LoginPage.tsx                   Login email+senha com "lembrar-me"
    ForgotPasswordPage.tsx          Solicitar reset de senha
    ResetPasswordPage.tsx           Redefinir senha com indicador de forca
    MagicLinkRequestPage.tsx        Solicitar magic link
    MagicLinkVerifyPage.tsx         Verificar token de magic link
    TotpChallengePage.tsx           Verificar codigo TOTP (6 digitos)
```

---

## Exports publicos (barrel)

```typescript
export { AuthProvider, useAuth, useAuthDispatch } from './contexts/AuthContext';
export type { AuthContextType } from './contexts/AuthContext';
export type {
  AuthUser,
  LoginResult,
  VerifiedSession,
  TotpSetupData,
  SessionAction,
  SessionState,
} from './types/auth';
```

---

## Acessibilidade (a11y)

Atributos implementados nos formularios de auth:

| Atributo                      | Onde                                      |
|-------------------------------|-------------------------------------------|
| `role="alert"`                | Todas as mensagens de erro dinamicas      |
| `aria-busy={loading}`         | Todos os botoes de submit                 |
| `autoComplete="email"`        | Campos de email                           |
| `autoComplete="current-password"` | Campo de senha do login              |
| `autoComplete="new-password"` | Campos de senha do reset                  |
| `inputMode="numeric"`         | Campo OTP do TOTP                         |

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `auth.layout.*`, `auth.login.*`, `auth.forgotPassword.*`, `auth.resetPassword.*`, `auth.magicLink.*`, `auth.totp.*`.
