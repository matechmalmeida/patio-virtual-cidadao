# Profile Module - API Contract

Contrato da API para o modulo de perfil do Patio Virtual.

O frontend permite ao cidadao visualizar e editar seus dados pessoais, endereco, preferencias (idioma, tema, push notifications) e seguranca (2FA).

---

## Endpoints

### 1. Consultar perfil

```
GET /api/profile
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Response

`200 OK` retorna um objeto `UserProfile`.

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  avatarUrl: string | null;
  totpEnabled: boolean;
}
```

| Campo          | Tipo             | Descricao                              |
|----------------|-----------------|----------------------------------------|
| `id`           | `string`        | Identificador unico do usuario         |
| `name`         | `string`        | Nome completo                          |
| `email`        | `string`        | Email (somente leitura no frontend)    |
| `phone`        | `string`        | Telefone formatado                     |
| `cpf`          | `string`        | CPF formatado                          |
| `avatarUrl`    | `string \| null`| URL do avatar ou null                  |
| `totpEnabled`  | `boolean`       | Se 2FA esta habilitado                 |

---

### 2. Atualizar perfil

```
PUT /api/profile
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Request Body

```typescript
{
  name: string;
  phone: string;
  cpf: string;
}
```

| Campo   | Tipo     | Obrigatorio | Descricao               |
|---------|----------|-------------|-------------------------|
| `name`  | `string` | Sim         | Nome completo           |
| `phone` | `string` | Sim         | Telefone formatado      |
| `cpf`   | `string` | Sim         | CPF formatado           |

#### Response

`200 OK` retorna o `UserProfile` atualizado.

---

### 3. Upload de avatar

```
POST /api/profile/avatar
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Request Body (multipart/form-data)

| Campo  | Tipo   | Obrigatorio | Descricao                          |
|--------|--------|-------------|-------------------------------------|
| `file` | `File` | Sim         | Imagem do avatar (max 5MB)         |

#### Response

`200 OK` retorna a URL do avatar.

```typescript
{
  avatarUrl: string;
}
```

---

### 4. Remover avatar

```
DELETE /api/profile/avatar
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Response

`200 OK` confirmacao de remocao.

---

### 5. Consultar endereco

```
GET /api/profile/address
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Response

`200 OK` retorna um objeto `UserAddress`.

```typescript
interface UserAddress {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}
```

| Campo          | Tipo     | Descricao                     |
|----------------|----------|-------------------------------|
| `cep`          | `string` | CEP formatado (XXXXX-XXX)     |
| `street`       | `string` | Logradouro                    |
| `number`       | `string` | Numero                        |
| `complement`   | `string` | Complemento (pode ser vazio)  |
| `neighborhood` | `string` | Bairro                        |
| `city`         | `string` | Cidade                        |
| `state`        | `string` | UF (2 caracteres)             |

---

### 6. Atualizar endereco

```
PUT /api/profile/address
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Request Body

```typescript
{
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}
```

Todos os campos sao obrigatorios exceto `complement`.

#### Response

`200 OK` retorna o `UserAddress` atualizado.

---

### 7. Consultar preferencias

```
GET /api/profile/preferences
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Response

`200 OK` retorna um objeto `UserPreferences`.

```typescript
interface UserPreferences {
  language: 'pt' | 'en' | 'es';
  theme: 'light' | 'dark';
  pushNotifications: boolean;
}
```

| Campo               | Tipo      | Descricao                          |
|---------------------|-----------|------------------------------------|
| `language`          | `string`  | Idioma preferido                   |
| `theme`             | `string`  | Tema visual                        |
| `pushNotifications` | `boolean` | Push notifications habilitadas     |

---

### 8. Atualizar preferencias

```
PATCH /api/profile/preferences
```

#### Headers

```
Authorization: Bearer {sessionToken}
```

#### Request Body

```typescript
Partial<UserPreferences>
```

Aceita atualizacao parcial. Campos ausentes nao sao alterados.

#### Response

`200 OK` retorna o `UserPreferences` atualizado.

---

## Dados de teste (mock)

| Campo       | Valor                          |
|-------------|--------------------------------|
| Nome        | Joao Silva                     |
| Email       | cidadao@email.com              |
| Telefone    | (11) 99999-8888                |
| CPF         | 123.456.789-00                 |
| Endereco    | Praca da Se, 100, Apto 42     |
| Bairro      | Se                             |
| Cidade      | Sao Paulo                      |
| UF          | SP                             |
| CEP         | 01001-000                      |
| Idioma      | pt                             |
| Tema        | light                          |

---

## Rotas do modulo

| Rota                        | Pagina            | Descricao                                    |
|-----------------------------|-------------------|----------------------------------------------|
| `/app/profile`              | ProfilePage       | Hub do perfil com avatar e menu de navegacao |
| `/app/profile/dados`        | PersonalDataPage  | Edicao de nome, telefone e CPF               |
| `/app/profile/endereco`     | AddressPage       | Edicao de endereco completo                  |
| `/app/profile/preferencias` | PreferencesPage   | Idioma, tema, push e seguranca (2FA)         |

Todas as rotas sao protegidas por `<RequireAuth />` e renderizadas dentro de `<AppLayout />`.

---

## Validacao de formularios (frontend)

### Dados pessoais

| Campo  | Regras                                       |
|--------|----------------------------------------------|
| name   | Obrigatorio, min. 2 caracteres               |
| email  | Formato email valido (somente leitura)        |
| phone  | Obrigatorio, min. 14 caracteres (com mascara) |
| cpf    | Obrigatorio, min. 14 caracteres (com mascara) |

### Endereco

| Campo        | Regras                     |
|--------------|----------------------------|
| cep          | Obrigatorio, min. 9 chars  |
| street       | Obrigatorio, min. 2 chars  |
| number       | Obrigatorio, min. 1 char   |
| complement   | Opcional                   |
| neighborhood | Obrigatorio, min. 2 chars  |
| city         | Obrigatorio, min. 2 chars  |
| state        | Obrigatorio, exatamente 2 chars (UF) |

### Mascaras de input

| Campo    | Formato                | Exemplo            |
|----------|------------------------|--------------------|
| phone    | `(XX) XXXXX-XXXX`     | (11) 99999-8888    |
| cpf      | `XXX.XXX.XXX-XX`      | 123.456.789-00     |
| cep      | `XXXXX-XXX`           | 01001-000          |

---

## Persistencia local

| Chave       | Storage        | Descricao                     |
|-------------|----------------|-------------------------------|
| `pv-avatar` | `localStorage` | URL do avatar do usuario      |

---

## Estrutura de arquivos

```
src/modules/profile/
  index.ts                          Barrel exports
  types/
    profile.ts                      UserProfile, UserAddress, UserPreferences, payloads
  services/
    profile.service.ts              getProfile, updateProfile, uploadAvatar, removeAvatar, getAddress, updateAddress, getPreferences, updatePreferences
  components/
    ProfileHeader.tsx               Header com avatar editavel
    ProfileMenuCard.tsx             Card de menu com icone e navegacao
  pages/
    ProfilePage.tsx                 Hub principal do perfil
    PersonalDataPage.tsx            Edicao de dados pessoais
    AddressPage.tsx                 Edicao de endereco
    PreferencesPage.tsx             Preferencias, tema, idioma, 2FA
```

---

## Exports publicos (barrel)

```typescript
export { ProfileHeader } from './components/ProfileHeader';
export { ProfileMenuCard } from './components/ProfileMenuCard';
export type {
  UserProfile,
  UserAddress,
  UserPreferences,
  UpdateProfilePayload,
  UpdateAddressPayload,
} from './types/profile';
```

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Chaves i18n do modulo: `profile.*`, `common.*`, `language.*`, `auth.totp.*`.
