# Site Module - API Contract

Contrato da API para o modulo de landing page do Patio Virtual.

O frontend consome um unico endpoint que retorna todo o conteudo da pagina inicial, localizado por idioma.

---

## Endpoint

```
GET /api/site/content?lang={lang}
```

### Query Parameters

| Parametro | Tipo     | Obrigatorio | Descricao                                      |
|-----------|----------|-------------|-------------------------------------------------|
| `lang`    | `string` | Sim         | Codigo do idioma. Valores aceitos: `pt`, `en`, `es` |

### Response

`200 OK` retorna um objeto `SiteContent` (descrito abaixo).

---

## Interfaces

### SiteContent (raiz)

Objeto principal retornado pelo endpoint.

```typescript
interface SiteContent {
  hero: SiteHero;
  stats: SiteStat[];
  steps: SiteStep[];
  advantages: SiteAdvantage[];
  comparison: {
    traditional: SiteComparisonColumn;
    virtual: SiteComparisonColumn;
  };
  faqs: SiteFAQ[];
  cta: SiteCta;
  footerCopyright: string;
}
```

| Campo             | Tipo                   | Descricao                                              |
|-------------------|------------------------|--------------------------------------------------------|
| `hero`            | `SiteHero`             | Conteudo do banner principal (hero section)             |
| `stats`           | `SiteStat[]`           | Metricas exibidas abaixo do hero. Esperado: 3 itens    |
| `steps`           | `SiteStep[]`           | Etapas do "Como funciona". Esperado: 4 itens           |
| `advantages`      | `SiteAdvantage[]`      | Lista de vantagens/beneficios. Esperado: 6 itens       |
| `comparison`      | `object`               | Comparativo entre patio tradicional e virtual           |
| `comparison.traditional` | `SiteComparisonColumn` | Coluna do patio tradicional (pontos negativos) |
| `comparison.virtual`     | `SiteComparisonColumn` | Coluna do patio virtual (pontos positivos)     |
| `faqs`            | `SiteFAQ[]`            | Perguntas frequentes. Esperado: 5 itens                |
| `cta`             | `SiteCta`              | Call-to-action final                                   |
| `footerCopyright` | `string`               | Texto de copyright do rodape                           |

---

### SiteHero

Banner principal da pagina.

```typescript
interface SiteHero {
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
}
```

| Campo       | Tipo     | Descricao                                                                 | Exemplo (pt)                                                        |
|-------------|----------|---------------------------------------------------------------------------|---------------------------------------------------------------------|
| `badge`     | `string` | Texto do selo acima do titulo                                             | `"Programa oficial da autarquia de transito"`                       |
| `title`     | `string` | Titulo principal (primeira parte)                                         | `"Seu carro fica em casa,"`                                        |
| `highlight` | `string` | Parte destacada do titulo (renderizada em cor primaria)                   | `"nao no patio."`                                                  |
| `subtitle`  | `string` | Subtitulo descritivo abaixo do titulo                                     | `"O Patio Virtual substitui a remocao do veiculo..."` |

---

### SiteStat

Metrica exibida na barra de estatisticas.

```typescript
interface SiteStat {
  value: string;
  label: string;
}
```

| Campo   | Tipo     | Descricao                           | Exemplo (pt)            |
|---------|----------|-------------------------------------|-------------------------|
| `value` | `string` | Valor numerico ou textual em destaque | `"R$ 0"`, `"100%"`    |
| `label` | `string` | Descricao da metrica                | `"Taxa de guincho"`     |

---

### SiteStep

Etapa do processo "Como funciona".

```typescript
interface SiteStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}
```

| Campo         | Tipo     | Descricao                                                 | Exemplo (pt)                                |
|---------------|----------|-----------------------------------------------------------|---------------------------------------------|
| `number`      | `string` | Numero da etapa, zero-padded                              | `"01"`, `"02"`, `"03"`, `"04"`             |
| `title`       | `string` | Titulo curto da etapa                                     | `"Abordagem na blitz"`                     |
| `description` | `string` | Descricao da etapa                                        | `"O agente identifica a irregularidade..."` |
| `icon`        | `string` | Nome do icone (Lucide React). Ver tabela de icones abaixo | `"Car"`                                    |

---

### SiteAdvantage

Vantagem/beneficio do programa.

```typescript
interface SiteAdvantage {
  title: string;
  description: string;
  icon: string;
}
```

| Campo         | Tipo     | Descricao                                                 | Exemplo (pt)                           |
|---------------|----------|-----------------------------------------------------------|----------------------------------------|
| `title`       | `string` | Titulo da vantagem                                        | `"Seu carro fica em casa"`            |
| `description` | `string` | Descricao da vantagem                                     | `"Em vez de ir para o patio..."` |
| `icon`        | `string` | Nome do icone (Lucide React). Ver tabela de icones abaixo | `"Home"`                              |

---

### SiteComparisonColumn

Coluna do comparativo (tradicional vs virtual).

```typescript
interface SiteComparisonColumn {
  title: string;
  items: string[];
}
```

| Campo   | Tipo       | Descricao                                     | Exemplo (pt)                        |
|---------|------------|-----------------------------------------------|-------------------------------------|
| `title` | `string`   | Titulo da coluna                              | `"Patio Tradicional"`              |
| `items` | `string[]` | Lista de itens de comparacao. Esperado: 6 itens | `["Veiculo guinchado", "Custo de guincho + diarias", ...]` |

---

### SiteFAQ

Pergunta frequente.

```typescript
interface SiteFAQ {
  question: string;
  answer: string;
}
```

| Campo      | Tipo     | Descricao          | Exemplo (pt)                                                   |
|------------|----------|--------------------|-----------------------------------------------------------------|
| `question` | `string` | Pergunta           | `"O que e o Patio Virtual?"`                                   |
| `answer`   | `string` | Resposta (texto plano) | `"E um programa que substitui a remocao do veiculo..."` |

---

### SiteCta

Call-to-action final da pagina.

```typescript
interface SiteCta {
  title: string;
  description: string;
}
```

| Campo         | Tipo     | Descricao                                  | Exemplo (pt)                                                   |
|---------------|----------|--------------------------------------------|-----------------------------------------------------------------|
| `title`       | `string` | Titulo do CTA                              | `"Acesse seu caso agora"`                                      |
| `description` | `string` | Texto de apoio                             | `"Use o codigo que voce recebeu durante a abordagem..."` |

---

## Icones suportados

O campo `icon` em `SiteStep` e `SiteAdvantage` aceita os seguintes valores (mapeados para icones da biblioteca Lucide React):

| Valor          | Descricao                | Uso atual                         |
|----------------|--------------------------|-----------------------------------|
| `Car`          | Veiculo                  | Step: Abordagem na blitz          |
| `MapPin`       | Localizacao              | Step: Dispositivo instalado       |
| `FileCheck`    | Documento verificado     | Step: Regularize online           |
| `CheckCircle2` | Conclusao                | Step: Retire o dispositivo        |
| `Home`         | Residencia               | Advantage: Carro fica em casa     |
| `Wallet`       | Financas                 | Advantage: Economia real          |
| `Clock`        | Tempo/praticidade        | Advantage: Resolva pelo celular   |
| `ShieldCheck`  | Seguranca                | Advantage: Seguro e transparente  |
| `Smartphone`   | Dispositivo movel        | Advantage: Sem burocracia         |
| `CalendarDays` | Agendamento              | Advantage: Agendamento facil      |

Valores nao reconhecidos usam `ShieldCheck` como fallback.

---

## Exemplo de response completo (pt)

```json
{
  "hero": {
    "badge": "Programa oficial da autarquia de transito",
    "title": "Seu carro fica em casa,",
    "highlight": "nao no patio.",
    "subtitle": "O Patio Virtual substitui a remocao do veiculo. Resolva suas pendencias pelo celular e evite guincho, diarias e burocracia."
  },
  "stats": [
    { "value": "R$ 0", "label": "Taxa de guincho" },
    { "value": "R$ 0", "label": "Diarias de patio" },
    { "value": "100%", "label": "Digital e online" }
  ],
  "steps": [
    {
      "number": "01",
      "title": "Abordagem na blitz",
      "description": "O agente identifica a irregularidade e oferece o Patio Virtual como alternativa a remocao.",
      "icon": "Car"
    },
    {
      "number": "02",
      "title": "Dispositivo instalado",
      "description": "Um dispositivo GPS e conectado ao veiculo. Voce leva o carro para casa em seguranca.",
      "icon": "MapPin"
    },
    {
      "number": "03",
      "title": "Regularize online",
      "description": "Acesse o portal, veja suas pendencias, pague e envie os comprovantes pelo celular.",
      "icon": "FileCheck"
    },
    {
      "number": "04",
      "title": "Retire o dispositivo",
      "description": "Com tudo regularizado, agende a retirada do dispositivo em um ponto autorizado.",
      "icon": "CheckCircle2"
    }
  ],
  "advantages": [
    {
      "icon": "Home",
      "title": "Seu carro fica em casa",
      "description": "Em vez de ir para o patio, o veiculo vai direto para sua residencia com um dispositivo de monitoramento."
    },
    {
      "icon": "Wallet",
      "title": "Economia real",
      "description": "Sem custos de guincho, diarias de patio ou taxas extras. Voce paga apenas suas pendencias."
    },
    {
      "icon": "Clock",
      "title": "Resolva pelo celular",
      "description": "Acompanhe pendencias, envie comprovantes e agende a retirada do dispositivo — tudo online."
    },
    {
      "icon": "ShieldCheck",
      "title": "Seguro e transparente",
      "description": "Todo o processo e registrado digitalmente com auditoria completa e timeline em tempo real."
    },
    {
      "icon": "Smartphone",
      "title": "Sem burocracia",
      "description": "Acesse o portal com o codigo do caso e resolva tudo sem filas, sem deslocamentos."
    },
    {
      "icon": "CalendarDays",
      "title": "Agendamento facil",
      "description": "Quando tudo estiver regularizado, agende dia e horario para retirar o dispositivo."
    }
  ],
  "comparison": {
    "traditional": {
      "title": "Patio Tradicional",
      "items": [
        "Veiculo guinchado",
        "Custo de guincho + diarias",
        "Deslocamento ate o patio",
        "Filas e burocracia presencial",
        "Risco de danos ao veiculo",
        "Processo demorado"
      ]
    },
    "virtual": {
      "title": "Patio Virtual",
      "items": [
        "Veiculo fica em casa",
        "Sem custos de guincho ou diarias",
        "Resolva tudo pelo celular",
        "100% digital, sem filas",
        "Veiculo seguro na sua residencia",
        "Processo rapido e transparente"
      ]
    }
  },
  "faqs": [
    {
      "question": "O que e o Patio Virtual?",
      "answer": "E um programa que substitui a remocao do veiculo para o patio. Em vez de ter o carro guinchado, voce instala um dispositivo de monitoramento e leva o veiculo para casa ate regularizar as pendencias."
    },
    {
      "question": "Posso usar o carro durante o processo?",
      "answer": "Nao. O veiculo deve permanecer estacionado na sua residencia durante todo o processo de regularizacao. O sistema monitora e detecta qualquer movimentacao."
    },
    {
      "question": "Quanto custa?",
      "answer": "Nao ha custo de guincho nem diarias de patio. Voce paga apenas as pendencias do seu veiculo (multas, licenciamento, etc.)."
    },
    {
      "question": "E se eu tirar o dispositivo?",
      "answer": "A remocao e detectada automaticamente e gera uma violacao grave, podendo resultar na remocao fisica do veiculo para o patio."
    },
    {
      "question": "Como acesso o portal?",
      "answer": "Basta usar o codigo do caso que voce recebeu durante a abordagem e o telefone cadastrado. Voce recebera um codigo SMS para verificacao."
    }
  ],
  "cta": {
    "title": "Acesse seu caso agora",
    "description": "Use o codigo que voce recebeu durante a abordagem para acompanhar e resolver suas pendencias."
  },
  "footerCopyright": "2026 Patio Virtual. Todos os direitos reservados."
}
```

---

## Regras e observacoes

1. **Todos os campos sao obrigatorios.** O frontend nao trata campos ausentes individualmente.
2. **O conteudo deve ser retornado ja traduzido** no idioma solicitado pelo parametro `lang`.
3. **Texto plano apenas.** Nenhum campo aceita HTML, markdown ou formatacao especial.
4. **Tamanho dos arrays e fixo na UI atual:**
   - `stats`: 3 itens (renderizados em grid 3 colunas)
   - `steps`: 4 itens (renderizados em grid 4 colunas no desktop)
   - `advantages`: 6 itens (renderizados em grid 3 colunas no desktop)
   - `comparison.traditional.items`: 6 itens
   - `comparison.virtual.items`: 6 itens
   - `faqs`: 5 itens
5. **O campo `icon`** deve conter um dos valores da tabela de icones suportados. Valores desconhecidos resultam no icone `ShieldCheck` como fallback.
6. **O campo `number`** em `SiteStep` e exibido como texto decorativo (ex: "01", "02"). Nao precisa ser numerico.
7. **O campo `footerCopyright`** e exibido como texto simples no rodape. Exemplo: `"2026 Patio Virtual. Todos os direitos reservados."`

---

## Idiomas suportados

| Codigo | Idioma    | Fallback |
|--------|-----------|----------|
| `pt`   | Portugues | -        |
| `en`   | Ingles    | `pt`     |
| `es`   | Espanhol  | `pt`     |

Se o parametro `lang` nao for reconhecido, retornar conteudo em `pt`.

---

## Frontend: como o dado e consumido

```
GET /api/site/content?lang=pt
        |
        v
  useSiteContent() hook (React Query)
        |
        v
  queryKey: ['site', 'content', lang]
  staleTime: 30s | gcTime: 5min
        |
        v
  SitePage.tsx distribui os dados para:
    Navbar, HeroSection, StatsBar, HowItWorksSection,
    AdvantagesSection, ComparisonSection, FaqSection,
    CtaSection, Footer
```

Ao trocar o idioma, o hook refaz a requisicao com o novo `lang` e o cache e independente por idioma.

---

# Legal Pages - API Contract

Contrato da API para as paginas legais do Patio Virtual.

O frontend consome um endpoint que retorna o conteudo de uma pagina legal especifica, localizado por idioma.

---

## Endpoint

```
GET /api/legal/:slug?lang={lang}
```

### Path Parameters

| Parametro | Tipo     | Obrigatorio | Descricao                                      |
|-----------|----------|-------------|-------------------------------------------------|
| `slug`    | `string` | Sim         | Identificador da pagina legal. Valores aceitos: `termos-de-uso`, `privacidade`, `cookies`, `lgpd` |

### Query Parameters

| Parametro | Tipo     | Obrigatorio | Descricao                                      |
|-----------|----------|-------------|-------------------------------------------------|
| `lang`    | `string` | Sim         | Codigo do idioma. Valores aceitos: `pt`, `en`, `es` |

### Response

`200 OK` retorna um objeto `LegalPageContent` ou `null` se o slug nao for valido.

---

## Interfaces

### LegalPageContent (raiz)

```typescript
interface LegalPageContent {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
  footerCopyright: string;
}
```

| Campo             | Tipo              | Descricao                                    |
|-------------------|-------------------|----------------------------------------------|
| `title`           | `string`          | Titulo da pagina legal                       |
| `lastUpdated`     | `string`          | Data da ultima atualizacao (formato localizado) |
| `sections`        | `LegalSection[]`  | Secoes do conteudo legal                     |
| `footerCopyright` | `string`          | Texto de copyright do rodape                 |

### LegalSection

```typescript
interface LegalSection {
  title: string;
  content: string;
}
```

| Campo     | Tipo     | Descricao                                          |
|-----------|----------|----------------------------------------------------|
| `title`   | `string` | Titulo da secao                                    |
| `content` | `string` | Conteudo da secao. Paragrafos separados por `\n\n` |

---

## Slugs validos

| Slug               | Titulo (pt)                    | Rota                     |
|---------------------|-------------------------------|--------------------------|
| `termos-de-uso`     | Termos de Uso                 | `/legal/termos-de-uso`   |
| `privacidade`       | Politica de Privacidade       | `/legal/privacidade`     |
| `cookies`           | Politica de Cookies           | `/legal/cookies`         |
| `lgpd`              | Protecao de Dados (LGPD)     | `/legal/lgpd`            |

---

## Frontend: como o dado e consumido

```
GET /api/legal/:slug?lang=pt
        |
        v
  useLegalContent(slug) hook (React Query)
        |
        v
  queryKey: ['legal', slug, lang]
  staleTime: 30s | gcTime: 5min
        |
        v
  LegalPage.tsx renderiza:
    Navbar, conteudo legal (titulo, data, secoes), Footer
```

Ao trocar o idioma, o hook refaz a requisicao com o novo `lang` e o cache e independente por idioma e slug.
