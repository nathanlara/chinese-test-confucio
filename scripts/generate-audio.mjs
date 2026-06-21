import { mkdir, readFile, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env");
const defaultExamPath = path.join(rootDir, "exams", "basico-1-simulado.json");
const outputDir = path.join(rootDir, "assets", "audio");

const rawArgs = process.argv.slice(2);
const args = new Set(rawArgs);
const dryRun = args.has("--dry-run");
const force = args.has("--force");
const examArg = getArgValue("--exam");
const prefixArg = getArgValue("--prefix");

loadEnv(envPath);

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_TTS_MODEL || "gpt-4o-mini-tts";
const voice = process.env.OPENAI_TTS_VOICE || "marin";
const instructions =
  process.env.OPENAI_TTS_INSTRUCTIONS ||
  "Speak Mandarin Chinese clearly and naturally for a beginner listening exam. Use a calm teacher-like pace, accurate pronunciation, and no extra words.";

if (!dryRun && (!apiKey || apiKey === "coloque_sua_key_aqui" || apiKey === "sk-proj...")) {
  console.error("OPENAI_API_KEY não configurada. Edite .env antes de gerar os áudios.");
  process.exit(1);
}

const examPath = examArg ? path.resolve(rootDir, examArg) : defaultExamPath;
const exam = JSON.parse(await readFile(examPath, "utf8"));
const filePrefix = prefixArg || exam.id || "basico-1";
const audioQuestions = exam.sections
  .flatMap((section) => section.questions)
  .filter((question) => question.audioText);

await mkdir(outputDir, { recursive: true });

for (const question of audioQuestions) {
  const fileName = `${filePrefix}-q${String(question.id).padStart(2, "0")}.mp3`;
  const outputPath = path.join(outputDir, fileName);
  const relativePath = `./assets/audio/${fileName}`;

  question.audioSrc = relativePath;

  if (dryRun) {
    console.log(`${fileName} <- ${question.audioText}`);
    continue;
  }

  if (!force && (await fileExists(outputPath))) {
    console.log(`Pulando ${fileName}: arquivo ja existe. Use --force para recriar.`);
    continue;
  }

  console.log(`Gerando ${fileName}: ${question.audioText}`);
  const audio = await createSpeech({
    apiKey,
    model,
    voice,
    input: question.audioText,
    instructions,
  });
  await writeFile(outputPath, audio);
}

if (!dryRun) {
  await writeFile(examPath, `${JSON.stringify(exam, null, 2)}\n`);
}

if (dryRun) {
  console.log("Dry run concluído. Nenhum áudio foi gerado.");
} else {
  console.log(`Áudios gerados em ${path.relative(rootDir, outputDir)}.`);
  console.log(`JSON atualizado em ${path.relative(rootDir, examPath)}.`);
}

async function createSpeech({ apiKey, model, voice, input, instructions }) {
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      voice,
      input,
      instructions,
      response_format: "mp3",
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Erro da OpenAI (${response.status}): ${message}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function loadEnv(filePath) {
  try {
    const env = readFileSync(filePath);
    parseEnv(String(env)).forEach(([key, value]) => {
      if (!process.env[key]) process.env[key] = value;
    });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function parseEnv(source) {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
      return [key, value];
    })
    .filter(([key]) => key);
}

function getArgValue(name) {
  const equalsArg = rawArgs.find((arg) => arg.startsWith(`${name}=`));
  if (equalsArg) return equalsArg.slice(name.length + 1);

  const index = rawArgs.indexOf(name);
  if (index >= 0) return rawArgs[index + 1];

  return null;
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
