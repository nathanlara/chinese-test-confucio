import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "assets", "audio", "classifiers");
const manifestPath = path.join(rootDir, "games", "classifier-audio.json");
const rawArgs = process.argv.slice(2);
const dryRun = rawArgs.includes("--dry-run");
const force = rawArgs.includes("--force");

loadEnv(path.join(rootDir, ".env"));

const apiKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_TTS_MODEL || "qwen/qwen-audio-3.0-tts-flash";
const voice = process.env.OPENROUTER_TTS_VOICE || "loongjohn";

if (!dryRun && !apiKey) {
  console.error("OPENROUTER_API_KEY não configurada. Adicione a chave ao arquivo .env.");
  process.exit(1);
}

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const totalCharacters = manifest.items.reduce((total, item) => total + item.text.length, 0);
await mkdir(outputDir, { recursive: true });

console.log(`${manifest.items.length} arquivos · ${totalCharacters} caracteres · ${model} · voz ${voice}`);

for (const item of manifest.items) {
  const outputPath = path.join(outputDir, item.file);
  if (!force && (await fileExists(outputPath))) {
    console.log(`Pulando ${item.file}: já existe.`);
    continue;
  }

  console.log(`${dryRun ? "Preparado" : "Gerando"} ${item.file} <- ${item.text}`);
  if (dryRun) continue;

  await writeFile(outputPath, await createSpeech(item));
  await wait(700);
}

console.log(dryRun ? "Dry run concluído; nenhum áudio foi gerado." : `Áudios salvos em ${path.relative(rootDir, outputDir)}.`);

function loadEnv(filePath) {
  try {
    const source = String(readFileSync(filePath));
    source
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .forEach((line) => {
        const index = line.indexOf("=");
        if (index < 1) return;
        const key = line.slice(0, index).trim();
        const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
        if (!process.env[key]) process.env[key] = value;
      });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

async function fileExists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function createSpeech(item) {
  const maxAttempts = 7;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const response = await fetch("https://openrouter.ai/api/v1/audio/speech", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://nathanlara.github.io/chinese-test-confucio/",
        "X-Title": "Caderno de Exercícios Confúcio",
      },
      body: JSON.stringify({
        model,
        input: item.text,
        voice,
        response_format: "mp3",
      }),
    });

    if (response.ok) return Buffer.from(await response.arrayBuffer());

    const message = await response.text();
    const canRetry = response.status === 429 || response.status >= 500;
    if (!canRetry || attempt === maxAttempts) {
      throw new Error(`OpenRouter ${response.status} ao gerar ${item.file}: ${message}`);
    }

    const delayMs = Math.min(20000, attempt * 2500);
    console.log(`Aguardando ${delayMs / 1000}s após erro ${response.status} (${attempt}/${maxAttempts})…`);
    await wait(delayMs);
  }
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
