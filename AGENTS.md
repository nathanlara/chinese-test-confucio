# AGENTS.md

## Visão geral

Site **estático** de exercícios de chinês (Instituto Confúcio). Sem backend, sem banco, sem build e sem framework. HTML + CSS + JavaScript ES modules puro. Conteúdo em JSON e áudios MP3 locais.

Três páginas independentes:

- `index.html` — página inicial com painel de progresso, marcador e lista de revisões (`data-page="home"`).
- `simulados.html` — revisões com correção automática (`data-page="exams"`).
- `jogos.html` — jogos de classificadores + guia de consulta (`data-page="games"`).

O mesmo `src/app.js` roda nas três páginas e decide o que inicializar via `document.body.dataset.page` no final do arquivo. A página inicial lê `exams/index.json` e o `localStorage` para montar o painel de progresso e a lista de revisões.

## Rodar localmente

O app usa `fetch` para ler JSONs, então **não abra via `file://`** — precisa de servidor:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Não há `package.json`, lint, typecheck nem testes automatizados. A verificação é manual no navegador.

## Gerar áudios

Os scripts são Node ESM (`.mjs`), sem dependências externas. Leem variáveis de `.env` (veja `.env.example`).

```bash
node scripts/generate-audio.mjs --dry-run        # prévia (OpenAI TTS, provas)
node scripts/generate-audio.mjs                  # gera mp3 e atualiza audioSrc no JSON
node scripts/generate-game-audio.mjs --dry-run   # prévia (OpenRouter TTS, jogos)
node scripts/generate-game-audio.mjs
```

Flags de `generate-audio.mjs`: `--exam <path>`, `--prefix <nome>`, `--force`, `--dry-run`.
`generate-game-audio.mjs`: `--force`, `--dry-run`. Ele tem retry com backoff para 429/5xx.

Atenção: `generate-audio.mjs` **reescreve o arquivo JSON da prova** ao gravar `audioSrc`. Rode `--dry-run` antes e revise o `git diff`.

## Mapa de arquivos

```
index.html / simulados.html / jogos.html   páginas
src/app.js                lógica das provas + jogos (single module)
src/classifier-content.js dados dos jogos (pares, lições, questões)
src/styles.css            todos os estilos
exams/index.json          catálogo de provas (carregado primeiro)
exams/*.json              conteúdo de cada prova
games/classifier-audio.json  manifesto de textos -> arquivos mp3 dos jogos
assets/audio/             mp3 das provas
assets/audio/classifiers/ mp3 dos jogos
assets/images/            imagens das questões
scripts/*.mjs             geradores de áudio
```

## Estrutura de uma prova (`exams/*.json`)

Campos de topo: `id`, `title`, `description`, e opcionais `uiVariant` (`"written-test"`), `suggestedTime`, `totalPoints`, `sections[]`.

Cada `section`: `id`, `title`, `shortTitle`, `instructions`, `points?`, `questions[]`, e opcionais `sharedWordBank[]`, `sharedOptions[]`.

Cada `question`: `id` (numérico, usado no `name` do input e nos anchors), `type`, `prompt` (ou `displayPrompt`), `pinyin?`, `help?`, `image?` (`{ src, alt }` ou `{ label }`), `audioText?`, `audioSrc?`, `options[]?`, `answer`, `answerLabel?`, `answerPinyin?`, `explanation?`, `wordBank?`, `matchOptions?`, `placeholder?`.

Tipos (`type`) e correção em `src/app.js:isCorrect`:

- `true-false` / `multiple-choice` / `match` — comparam o `value` da opção com `answer` (match usa `select`).
- `fill-blank` — comparação normalizada (ignora acentos, espaços e pontuação).
- `translation` / `word-order` — `textarea`, comparação normalizada.
- `answer` pode ser string ou lista de respostas aceitas.

Para adicionar uma prova: crie o JSON, registre em `exams/index.json` e referencie áudio/imagem com caminhos relativos (`./assets/...`).

## Jogos (`jogos.html`)

Seis jogos em `src/classifier-content.js`: pares (`classifierPairs`), lacuna (`fillGameQuestions`), escolha (`quickGameQuestions`, derivado de `classifierPairs`), ordem (`orderGameQuestions`), tradução (`translateGameQuestions`) e verdadeiro/falso (`truthGameQuestions`). O guia usa `classifierLessons`.

- `renderClassifierGames` monta o índice de práticas; cada jogo tem `render*Game`/`handle*Answer`/`reset*Game`.
- Os decks são embaralhados no boot via `prepareQuestionDeck`.
- Áudio das revisões e dos jogos: botões `[data-game-audio]`, delegação de evento em `handleGameAudioClick` (não use `<audio>` nativo aqui).
- Todo áudio dos jogos precisa existir em `games/classifier-audio.json` e em `assets/audio/classifiers/`.

## Convenções

- **Idioma da UI e dos textos: português** (conteúdo chinês em hanzi/pinyin). Siga o tom existente.
- **Sem dependências novas.** Não introduza framework, bundler ou biblioteca sem necessidade explícita.
- **Escape sempre o conteúdo dinâmico** com `escapeHtml()` antes de injetar em `innerHTML`.
- **Cache-busting manual:** ao mudar `src/app.js` ou `src/styles.css`, atualize a query `?v=...` nos três HTMLs. Ao mudar conteúdo carregado via `fetch`, atualize `APP_VERSION` em `src/app.js` (ele limpa o `localStorage` antigo no `syncAppVersion`).
- **Persistência:** respostas ficam em `localStorage` sob `chinese-test:<examId>:answers`; o progresso é recalculado a cada `input`. A última correção fica em `chinese-test:<examId>:result` e a última revisão aberta em `chinese-test:last-exam`; a página inicial usa essas chaves no painel de progresso e na lista de revisões.
- **Estado da prova:** abrir uma revisão usa `?exam=<id>` e `history.pushState`; o botão “Todas as revisões” volta pelo histórico. A lista é recalculada ao retornar, então progresso e nota aparecem atualizados.
- Comentários: o código não usa comentários — mantenha assim.
- Estilo: funções `render*`/`handle*`, template strings, sem ponto e vírgula opcional? Não — o código usa `;`. Prefira nomes em inglês no código e português nos dados.

## Armadilhas

- IDs de questão precisam ser únicos por prova (viram `name="question-<id>"` e `id="q-<id>"`).
- `image` aceita `src` (arquivo) ou `label` (texto renderizado).
- Em `written-test`, pinyin aparece em contextos específicos (`shouldShowQuestionPinyin`) e os placeholders mudam (`getAnswerPlaceholder`).
- A página inicial e a tela de prova dependem de `fetch`; sem servidor local a lista não carrega e aparece um aviso de erro.
- A UI é intencionalmente limpa (cards, tipografia sans, fundo neutro e acento vinho), sem skeuomorfismo de papel/caderno. Mantenha os componentes de jogo/prova e o painel inicial dentro do mesmo sistema de `src/styles.css`.
- `generate-audio.mjs` só gera para questões com `audioText`; questões sem `audioText` não têm áudio.
- Git: commits seguem `feat:`/`refactor:` em inglês. Não commite `.env`.
