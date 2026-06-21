# Prova de Chines

App estatico simples para estudar provas de chines. Ele carrega provas em JSON, renderiza as questoes e mostra a nota no final. Nao usa banco de dados nem backend.

## Rodar localmente

Como o app usa `fetch` para ler os JSONs, rode um servidor local:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Gerar audios com OpenAI

1. Edite `.env` e coloque sua chave:

```bash
OPENAI_API_KEY=sua_key_aqui
```

2. Rode o gerador:

```bash
node scripts/generate-audio.mjs
```

Ele le as questoes com `audioText`, gera arquivos `.mp3` em `assets/audio/` e atualiza o campo `audioSrc` no JSON da prova.

Comandos uteis:

```bash
node scripts/generate-audio.mjs --dry-run
node scripts/generate-audio.mjs --force
```

O script usa o endpoint de speech da OpenAI com `gpt-4o-mini-tts` e voz `marin`, configuraveis no `.env`.

## Publicar

Funciona direto no GitHub Pages ou na Vercel, porque todos os arquivos sao estaticos.

No GitHub Pages, publique a branch principal e selecione a pasta raiz do repo como source.

## Adicionar uma prova

1. Crie um arquivo em `exams/minha-prova.json`.
2. Adicione a prova em `exams/index.json`.
3. Coloque audios em `assets/audio/` e imagens em `assets/images/`.
4. Referencie os arquivos no JSON com caminhos relativos, por exemplo:

```json
{
  "audioSrc": "./assets/audio/prova-1-q01.mp3",
  "image": {
    "src": "./assets/images/prova-1-q01.png",
    "alt": "Mulher segurando a bandeira do Brasil"
  }
}
```

## Tipos de questao

- `true-false`: alternativas verdadeiro/falso.
- `multiple-choice`: escolha unica.
- `fill-blank`: lacuna, aceita letra ou palavra se `answer` tiver uma lista.
- `match`: selecionar a imagem/letra correspondente.
- `word-order`: resposta aberta corrigida por texto normalizado.
- `translation`: resposta aberta corrigida por texto normalizado.

Para respostas abertas, a correcao ignora espacos e pontuacao comum. Quando houver mais de uma resposta correta, use uma lista:

```json
"answer": ["我们大学很大也很漂亮", "我们的大学很大也很漂亮"]
```
