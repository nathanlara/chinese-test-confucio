import {
  classifierLessons,
  classifierPairs,
  fillGameQuestions,
  orderGameQuestions,
  quickGameQuestions,
  translateGameQuestions,
  truthGameQuestions,
} from "./classifier-content.js";

const examSelect = document.querySelector("#examSelect");
const examIntro = document.querySelector("#examIntro");
const homeScreen = document.querySelector("#homeScreen");
const examScreen = document.querySelector("#examScreen");
const examCards = document.querySelector("#examCards");
const examForm = document.querySelector("#examForm");
const results = document.querySelector("#results");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const sectionNav = document.querySelector("#sectionNav");
const gameTabs = document.querySelector("#gameTabs");
const gameWorkspace = document.querySelector("#gameWorkspace");
const classifierGuide = document.querySelector("#classifierGuide");

const APP_VERSION = "2026-09-09-5";
const APP_VERSION_KEY = "chinese-test:app-version";

let activeExam = null;
let gradedAnswers = null;
let examIndex = null;
let activeGame = "pairs";
let pairGameState;
let fillGameState = { index: 0, score: 0, answered: false };
let quickGameState = { index: 0, score: 0, answered: false };
let orderGameState = { index: 0, selected: [], score: 0, answered: false, tokens: [] };
let translateGameState = { index: 0, score: 0, answered: false };
let truthGameState = { index: 0, score: 0, answered: false };
let activeGameAudio = null;

pairGameState = createPairGameState();
prepareQuestionDeck(fillGameQuestions, true);
prepareQuestionDeck(quickGameQuestions, true);
prepareQuestionDeck(orderGameQuestions);
prepareQuestionDeck(translateGameQuestions, true);
prepareQuestionDeck(truthGameQuestions);

const normalizers = {
  text(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[，。？！?!.、,;；:\s]/g, "");
  },
};

async function loadExamIndex() {
  const response = await fetch(withVersion("./exams/index.json"));
  if (!response.ok) throw new Error("Não foi possível carregar a lista de provas.");
  return response.json();
}

async function loadExam(path) {
  const response = await fetch(withVersion(path));
  if (!response.ok) throw new Error(`Não foi possível carregar ${path}.`);
  return response.json();
}

function fieldName(question) {
  return `question-${question.id}`;
}

function storageKey(exam = activeExam) {
  return exam ? `chinese-test:${exam.id}:answers` : null;
}

function withVersion(path) {
  const url = new URL(path, window.location.href);
  url.searchParams.set("v", APP_VERSION);
  return url;
}

function syncAppVersion() {
  const savedVersion = localStorage.getItem(APP_VERSION_KEY);
  if (savedVersion === APP_VERSION) return;

  Object.keys(localStorage)
    .filter((key) => key.startsWith("chinese-test:") && key !== APP_VERSION_KEY)
    .forEach((key) => localStorage.removeItem(key));

  localStorage.setItem(APP_VERSION_KEY, APP_VERSION);
}

function renderImageLike(item, className = "visual-prompt") {
  if (!item) return "";
  if (item.src) {
    return `<figure class="${className}"><img src="${item.src}" alt="${escapeHtml(item.alt || item.label || "")}" /></figure>`;
  }
  return `<div class="${className}">${escapeHtml(item.label || item.description || item)}</div>`;
}

function renderAudio(question) {
  if (question.audioSrc) {
    return `
      <div class="audio-row">
        <audio controls preload="none" src="${escapeHtml(question.audioSrc)}"></audio>
      </div>
    `;
  }

  return `
    <div class="audio-row">
      <span class="audio-missing">Áudio ainda não adicionado.</span>
    </div>
  `;
}

function renderChoices(question) {
  const name = fieldName(question);
  return `
    <div class="choices">
      ${question.options
        .map(
          (option) => `
            <label class="choice">
              ${option.image ? renderImageLike(option.image, "option-visual") : ""}
              <span>
                <input type="radio" name="${name}" value="${escapeHtml(option.id)}" />
                ${shouldShowOptionId(option.id) ? `<strong>${escapeHtml(option.id)}.</strong>` : ""} ${escapeHtml(option.label)}
              </span>
            </label>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderWordBank(question) {
  if (!question.wordBank?.length) return "";
  return `
    <ul class="word-bank">
      ${question.wordBank
        .map((word) => `<li>${escapeHtml(word.id)}. ${escapeHtml(word.text)} ${word.pinyin ? `<span>${escapeHtml(word.pinyin)}</span>` : ""}</li>`)
        .join("")}
    </ul>
  `;
}

function renderInput(question, section) {
  const name = fieldName(question);
  const placeholder = getAnswerPlaceholder(question, section);

  if (question.type === "translation" || question.type === "word-order") {
    return `<textarea name="${name}" autocomplete="off" spellcheck="false" placeholder="${escapeHtml(placeholder)}"></textarea>`;
  }

  if (question.type === "fill-blank") {
    return `<input type="text" name="${name}" autocomplete="off" placeholder="${escapeHtml(placeholder)}" />`;
  }

  if (question.type === "match") {
    return `
      <select class="answer-select" name="${name}">
        <option value="">Selecione a imagem</option>
        ${question.options.map((option) => `<option value="${escapeHtml(option.id)}">${escapeHtml(option.id)}. ${escapeHtml(option.label)}</option>`).join("")}
      </select>
    `;
  }

  return renderChoices(question);
}

function getAnswerPlaceholder(question, section) {
  if (question.placeholder) return question.placeholder;

  if (activeExam?.uiVariant === "written-test") {
    if (section?.id === "parte-1-vocabulario") return "Tradução em português";
    if (question.type === "word-order") return "Escreva a frase completa";
    if (question.type === "translation") return "Escreva em caracteres chineses";
    return "Complete a lacuna";
  }

  if (question.type === "translation" || question.type === "word-order") return "Digite sua resposta em chinês";
  if (question.type === "fill-blank") return "Resposta";
  return "Resposta";
}

function renderQuestion(question, section) {
  const prompt = question.displayPrompt || question.prompt;
  return `
    <article class="question" id="q-${question.id}" data-question-id="${question.id}">
      <div class="question-header">
        <div class="question-title">
          <h3>${escapeHtml(prompt)}</h3>
          ${shouldShowQuestionPinyin(question) ? `<p class="pinyin">${escapeHtml(question.pinyin)}</p>` : ""}
          ${question.help ? `<p>${escapeHtml(question.help)}</p>` : ""}
        </div>
        <span class="badge">${question.id}</span>
      </div>
      ${question.image ? renderImageLike(question.image) : ""}
      ${question.audioSrc || question.audioText ? renderAudio(question) : ""}
      ${renderWordBank(question)}
      ${question.matchOptions ? renderMatchOptions(question.matchOptions) : ""}
      ${renderInput(question, section)}
      <div class="feedback" id="feedback-${question.id}"></div>
    </article>
  `;
}

function renderMatchOptions(options) {
  return `
    <div class="match-grid">
      ${options.map((option) => renderImageLike(option.image || option, "option-visual")).join("")}
    </div>
  `;
}

function renderExam(exam) {
  activeExam = exam;
  gradedAnswers = null;
  results.hidden = true;
  results.innerHTML = "";
  examScreen.dataset.variant = exam.uiVariant || "default";
  examForm.className = `exam-form${exam.uiVariant ? ` ${exam.uiVariant}` : ""}`;

  examIntro.innerHTML = `
    <h2>${escapeHtml(exam.title)}</h2>
    <p>${escapeHtml(exam.description)}</p>
    ${renderExamMeta(exam)}
  `;

  sectionNav.innerHTML = exam.sections
    .map((section) => `<a href="#${section.id}">${escapeHtml(section.shortTitle || section.title)}</a>`)
    .join("");

  examForm.innerHTML = `
    ${exam.sections
      .map(
        (section) => `
          <section class="section" id="${section.id}">
            <div class="section-heading">
              <h2>${escapeHtml(section.title)}</h2>
              <span>${escapeHtml(formatSectionMeta(section))}</span>
            </div>
            ${section.instructions ? `<p class="prompt-text">${escapeHtml(section.instructions)}</p>` : ""}
            ${section.sharedWordBank ? renderSharedWordBank(section.sharedWordBank) : ""}
            ${section.sharedOptions ? renderSharedOptions(section.sharedOptions) : ""}
            ${section.questions.map((question) => renderQuestion(question, section)).join("")}
          </section>
        `,
      )
      .join("")}
    <div class="actions">
      <button class="btn secondary" type="button" id="clearBtn">Limpar respostas</button>
      <button class="btn" type="submit">Corrigir prova</button>
    </div>
  `;

  restoreAnswers();
  examForm.addEventListener("input", handleAnswerInput, { once: false });
  document.querySelector("#clearBtn").addEventListener("click", clearAnswers);
  updateProgress();
}

function renderExamMeta(exam) {
  const meta = [
    exam.suggestedTime ? ["Tempo sugerido", exam.suggestedTime] : null,
    exam.totalPoints ? ["Total", exam.totalPoints] : null,
  ].filter(Boolean);

  if (!meta.length) return "";

  return `
    <dl class="written-meta">
      ${meta.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
    </dl>
  `;
}

function formatSectionMeta(section) {
  if (section.points) return `${section.questions.length} questões · ${section.points}`;
  return `${section.questions.length} questões`;
}

function renderExamCards(index) {
  examCards.innerHTML = index.exams
    .map(
      (exam, position) => `
        <article class="exam-card">
          <div>
            <span class="exam-card-kicker">${escapeHtml(exam.level || `Prova ${position + 1}`)}</span>
            <h3>${escapeHtml(exam.title)}</h3>
            <p>${escapeHtml(exam.description || "Prova simulada com correção automática.")}</p>
          </div>
          <dl class="exam-meta">
            <div>
              <dt>Questões</dt>
              <dd>${escapeHtml(exam.questionCount || "30")}</dd>
            </div>
            <div>
              <dt>Áudio</dt>
              <dd>${escapeHtml(exam.audioCount || "10")}</dd>
            </div>
          </dl>
          <button class="btn start-exam" type="button" data-exam-path="${escapeHtml(exam.path)}">Começar prova</button>
        </article>
      `,
    )
    .join("");

  examCards.querySelectorAll(".start-exam").forEach((button) => {
    button.addEventListener("click", () => startExam(button.dataset.examPath));
  });
}

async function startExam(path) {
  const exam = await loadExam(path);
  examSelect.value = path;
  renderExam(exam);
  homeScreen.hidden = true;
  examScreen.hidden = false;
  updateExamUrl(exam);
  examScreen.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderSharedWordBank(words) {
  return `
    <ul class="word-bank">
      ${words.map((word) => `<li>${escapeHtml(word.id)}. ${escapeHtml(word.text)} ${word.pinyin ? `<span>${escapeHtml(word.pinyin)}</span>` : ""}</li>`).join("")}
    </ul>
  `;
}

function renderSharedOptions(options) {
  return `
    <div class="match-grid">
      ${options
        .map(
          (option) => `
            <div class="shared-option">
              ${renderImageLike(option.image || option, "option-visual")}
              <strong>${escapeHtml(option.label)}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function getAllQuestions() {
  return activeExam.sections.flatMap((section) =>
    section.questions.map((question) => ({
      ...question,
      sectionTitle: section.title,
    })),
  );
}

function getAnswer(question) {
  const data = new FormData(examForm);
  return String(data.get(fieldName(question)) || "").trim();
}

function getSavedAnswers() {
  const answers = {};
  getAllQuestions().forEach((question) => {
    answers[fieldName(question)] = getAnswer(question);
  });
  return answers;
}

function saveAnswers() {
  const key = storageKey();
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(getSavedAnswers()));
}

function restoreAnswers() {
  const key = storageKey();
  if (!key) return;

  try {
    const saved = JSON.parse(localStorage.getItem(key) || "{}");
    Object.entries(saved).forEach(([name, value]) => {
      const fields = examForm.elements[name];
      if (!fields) return;

      if (fields instanceof RadioNodeList) {
        fields.value = value;
        return;
      }

      fields.value = value;
    });
  } catch (error) {
    localStorage.removeItem(key);
  }
}

function handleAnswerInput() {
  updateProgress();
  saveAnswers();
}

function isCorrect(question, answer) {
  if (!answer) return false;
  const accepted = Array.isArray(question.answer) ? question.answer : [question.answer];

  if (question.type === "translation" || question.type === "word-order") {
    const normalizedAnswer = normalizers.text(answer);
    return accepted.some((item) => normalizers.text(item) === normalizedAnswer);
  }

  if (question.type === "fill-blank") {
    const normalizedAnswer = normalizers.text(answer);
    return accepted.some((item) => normalizers.text(item) === normalizedAnswer);
  }

  return accepted.includes(answer);
}

function gradeExam(event) {
  event.preventDefault();
  const questions = getAllQuestions();
  gradedAnswers = questions.map((question) => {
    const answer = getAnswer(question);
    const correct = isCorrect(question, answer);
    return { question, answer, correct };
  });

  const correctCount = gradedAnswers.filter((item) => item.correct).length;
  const total = questions.length;
  const percent = Math.round((correctCount / total) * 100);

  gradedAnswers.forEach(({ question, answer, correct }) => {
    const card = document.querySelector(`[data-question-id="${question.id}"]`);
    const feedback = document.querySelector(`#feedback-${question.id}`);
    card.classList.add("is-graded", correct ? "is-correct" : "is-incorrect");
    card.classList.remove(correct ? "is-incorrect" : "is-correct");
    feedback.innerHTML = `
      <span class="${correct ? "correct" : "incorrect"}">${correct ? "Correta" : "Revisar"}</span>
      <div>Sua resposta: ${escapeHtml(answer || "em branco")}</div>
      <div>Gabarito: ${escapeHtml(formatAnswer(question))}</div>
      ${question.answerPinyin ? `<div class="pinyin">${escapeHtml(question.answerPinyin)}</div>` : ""}
      ${question.explanation && question.explanation !== question.answerPinyin ? `<div class="explanation">${escapeHtml(question.explanation)}</div>` : ""}
      ${question.audioText ? `<div class="explanation">Áudio: ${escapeHtml(question.audioText)}</div>` : ""}
    `;
  });

  results.hidden = false;
  results.innerHTML = `
    <h2>Resultado: ${correctCount}/${total}</h2>
    <p>Nota ${percent}%. ${getResultMessage(percent)}</p>
    <div class="result-list">
      ${gradedAnswers
        .map(
          ({ question, correct }) => `
            <div class="result-item">
              <span class="${correct ? "correct" : "incorrect"}">${question.id}. ${correct ? "Correta" : "Revisar"}</span>
              <span>${escapeHtml(question.displayPrompt || question.prompt)}</span>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatAnswer(question) {
  const answer = Array.isArray(question.answer) ? question.answer[0] : question.answer;
  if (question.answerLabel) return question.answerLabel;
  return answer;
}

function getResultMessage(percent) {
  if (percent >= 90) return "Mandou muito bem.";
  if (percent >= 70) return "Boa base, vale revisar os erros.";
  if (percent >= 50) return "Você já tem material para estudar com foco.";
  return "Refaça com calma e compare cada resposta com o gabarito.";
}

function updateProgress() {
  if (!activeExam) return;
  const questions = getAllQuestions();
  const answered = questions.filter((question) => getAnswer(question)).length;
  progressText.textContent = `${answered}/${questions.length}`;
  progressBar.style.width = `${questions.length ? (answered / questions.length) * 100 : 0}%`;
}

function clearAnswers() {
  examForm.reset();
  gradedAnswers = null;
  const key = storageKey();
  if (key) localStorage.removeItem(key);
  document.querySelectorAll(".question").forEach((card) => {
    card.classList.remove("is-graded", "is-correct", "is-incorrect");
  });
  document.querySelectorAll(".feedback").forEach((feedback) => {
    feedback.innerHTML = "";
  });
  results.hidden = true;
  results.innerHTML = "";
  updateProgress();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function shouldShowOptionId(id) {
  return /^[A-Z0-9]{1,2}$/.test(String(id));
}

function shouldShowQuestionPinyin(question) {
  if (!question.pinyin) return false;
  if (question.audioSrc || question.audioText) return false;
  if (activeExam?.uiVariant === "written-test") return true;
  if (question.type === "fill-blank") return false;
  return true;
}

function getExamSlug(exam) {
  return exam?.id || "";
}

function updateExamUrl(exam) {
  const url = new URL(window.location.href);
  url.searchParams.set("exam", getExamSlug(exam));
  window.history.replaceState({}, "", url);
}

function clearExamUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("exam");
  window.history.replaceState({}, "", url);
}

function createPairGameState() {
  const roundPairs = shuffle(classifierPairs).slice(0, 12);
  const cards = shuffle(
    roundPairs.flatMap((pair) => [
      { pairId: pair.id, kind: "classifier", label: pair.classifier, detail: pair.pinyin },
      { pairId: pair.id, kind: "noun", label: pair.noun, detail: pair.phrase },
    ]),
  );

  return { cards, pairCount: roundPairs.length, flipped: [], matched: [], attempts: 0, locked: false, lastMatch: null };
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function prepareQuestionDeck(items, shuffleOptions = false) {
  items.splice(0, items.length, ...shuffle(items));
  if (shuffleOptions) {
    items.forEach((item) => {
      item.options = shuffle(item.options);
    });
  }
}

function renderClassifierEducation() {
  const groups = classifierLessons.reduce((result, lesson) => {
    if (!result.has(lesson.category)) result.set(lesson.category, []);
    result.get(lesson.category).push(lesson);
    return result;
  }, new Map());

  classifierGuide.innerHTML = [...groups.entries()]
    .map(
      ([category, lessons]) => `
        <section class="lesson-group" aria-labelledby="lesson-${slugify(category)}">
          <h3 id="lesson-${slugify(category)}">${escapeHtml(category)}</h3>
          <div class="lesson-grid">
            ${lessons
              .map(
                (lesson) => `
                  <article class="classifier-lesson">
                    <div class="lesson-symbol"><strong>${escapeHtml(lesson.classifier)}</strong><span>${escapeHtml(lesson.pinyin)}</span></div>
                    <div class="lesson-copy">
                      <h4>${escapeHtml(lesson.title)}</h4>
                      <p>${escapeHtml(lesson.usage)}</p>
                    </div>
                    <ul class="lesson-examples" aria-label="Exemplos com ${escapeHtml(lesson.classifier)}">
                      ${lesson.examples
                        .map(
                          ([hanzi, pinyin, translation]) => `
                            <li><strong>${escapeHtml(hanzi)}</strong><span>${escapeHtml(pinyin)}</span><small>${escapeHtml(translation)}</small></li>
                          `,
                        )
                        .join("")}
                    </ul>
                    ${renderGameAudio(lesson.audioSrc, `Ouvir ${lesson.examples[0][0]}`)}
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderClassifierGames() {
  const games = [
    ["pairs", "Encontre os pares", "01 · memória · 12 pares"],
    ["fill", "Complete a lacuna", `02 · frases · ${fillGameQuestions.length} rodadas`],
    ["quick", "Escolha o classificador", `03 · escolha · ${quickGameQuestions.length} rodadas`],
    ["order", "Monte a frase", `04 · ordem · ${orderGameQuestions.length} rodadas`],
    ["translate", "Traduza rápido", `05 · tradução · ${translateGameQuestions.length} rodadas`],
    ["truth", "Verdadeiro ou falso", `06 · revisão · ${truthGameQuestions.length} rodadas`],
  ];

  gameTabs.innerHTML = games
    .map(
      ([id, title, kicker]) => `
        <button class="game-tab${activeGame === id ? " is-active" : ""}" type="button" role="tab" aria-selected="${activeGame === id}" data-game="${id}">
          <span>${escapeHtml(kicker)}</span>
          ${escapeHtml(title)}
        </button>
      `,
    )
    .join("");

  gameTabs.querySelectorAll("[data-game]").forEach((tab) => {
    tab.addEventListener("click", () => {
      activeGame = tab.dataset.game;
      renderClassifierGames();
    });
  });

  if (activeGame === "pairs") renderPairsGame();
  if (activeGame === "fill") renderFillGame();
  if (activeGame === "quick") renderQuickGame();
  if (activeGame === "order") renderOrderGame();
  if (activeGame === "translate") renderTranslateGame();
  if (activeGame === "truth") renderTruthGame();
}

function renderPairsGame() {
  const { cards, pairCount, flipped, matched, attempts, lastMatch } = pairGameState;
  const isComplete = matched.length === cards.length;
  const lastMatchedPair = classifierPairs.find((pair) => pair.id === lastMatch);

  gameWorkspace.innerHTML = `
    <div class="game-panel pairs-panel">
      <div class="game-panel-copy">
        <span class="game-index">01 / 06 · memória</span>
        <h3>Encontre o par certo</h3>
        <p>Vire uma peça de classificador e uma de substantivo. Quando combinarem, a expressão aparece completa.</p>
        <div class="game-stats" aria-label="Progresso do jogo">
          <span><strong>${matched.length / 2}</strong> / ${pairCount} pares</span>
          <span><strong>${attempts}</strong> tentativas</span>
        </div>
        ${lastMatchedPair ? `<div class="match-listen"><strong>${escapeHtml(lastMatchedPair.phrase)}</strong>${renderGameAudio(lastMatchedPair.audioSrc, "Ouvir o par")}</div>` : ""}
        <button class="btn secondary game-reset" type="button">Embaralhar de novo</button>
      </div>
      <div class="pairs-board" aria-label="Cartas para encontrar pares">
        ${cards
          .map((card, index) => {
            const visible = flipped.includes(index) || matched.includes(index);
            return `
              <button class="pair-card${visible ? " is-visible" : ""}${matched.includes(index) ? " is-matched" : ""}" type="button" data-pair-index="${index}" aria-label="${visible ? escapeHtml(`${card.label} ${card.detail}`) : "Revelar carta"}" ${pairGameState.locked || matched.includes(index) ? "disabled" : ""}>
                <span class="pair-card-back">?</span>
                <span class="pair-card-front">
                  <strong>${escapeHtml(card.label)}</strong>
                  <small>${escapeHtml(card.detail)}</small>
                </span>
              </button>
            `;
          })
          .join("")}
      </div>
      ${isComplete ? `<div class="game-success"><strong>Boa!</strong> Você encontrou todos os pares em ${attempts} tentativas.</div>` : ""}
    </div>
  `;

  gameWorkspace.querySelector(".game-reset").addEventListener("click", () => {
    pairGameState = createPairGameState();
    renderPairsGame();
  });

  gameWorkspace.querySelectorAll("[data-pair-index]").forEach((card) => {
    card.addEventListener("click", () => handlePairCardClick(Number(card.dataset.pairIndex)));
  });
}

function handlePairCardClick(index) {
  if (pairGameState.locked || pairGameState.flipped.includes(index) || pairGameState.matched.includes(index)) return;

  pairGameState.flipped.push(index);
  renderPairsGame();

  if (pairGameState.flipped.length !== 2) return;

  pairGameState.locked = true;
  pairGameState.attempts += 1;
  const [first, second] = pairGameState.flipped;
  const isMatch = pairGameState.cards[first].pairId === pairGameState.cards[second].pairId;

  window.setTimeout(() => {
    if (isMatch) {
      pairGameState.matched.push(first, second);
      pairGameState.lastMatch = pairGameState.cards[first].pairId;
    }
    pairGameState.flipped = [];
    pairGameState.locked = false;
    renderPairsGame();
  }, isMatch ? 420 : 760);
}

function renderFillGame() {
  const question = fillGameQuestions[fillGameState.index];
  if (!question) {
    gameWorkspace.innerHTML = renderGameComplete("Lacunas completas", fillGameState.score, fillGameQuestions.length, "Você já praticou os classificadores mais comuns em frases.", "fill");
    gameWorkspace.querySelector(".game-reset").addEventListener("click", resetFillGame);
    return;
  }

  gameWorkspace.innerHTML = `
    <div class="game-panel fill-panel">
      <div class="game-panel-copy">
        <span class="game-index">02 / 06 · frases</span>
        <h3>Complete a lacuna</h3>
        <p>Escolha o classificador que deixa a frase natural em chinês.</p>
        <div class="game-stats"><span><strong>${fillGameState.index + 1}</strong> / ${fillGameQuestions.length}</span><span><strong>${fillGameState.score}</strong> acertos</span></div>
      </div>
      <div class="sentence-challenge">
        <p class="challenge-sentence">${escapeHtml(question.sentence)}</p>
        <p class="challenge-pinyin">${escapeHtml(question.pinyin)}</p>
        ${renderGameAudio(question.audioSrc, "Ouvir a frase completa")}
        <div class="answer-options" role="group" aria-label="Opções de resposta">
          ${question.options.map((option) => `<button class="answer-option" type="button" data-fill-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
        </div>
        <div class="game-feedback" aria-live="polite"></div>
      </div>
    </div>
  `;

  gameWorkspace.querySelectorAll("[data-fill-answer]").forEach((button) => {
    button.addEventListener("click", () => handleFillAnswer(button.dataset.fillAnswer));
  });
}

function handleFillAnswer(answer) {
  if (fillGameState.answered) return;
  fillGameState.answered = true;
  const question = fillGameQuestions[fillGameState.index];
  const correct = answer === question.answer;
  if (correct) fillGameState.score += 1;
  renderFillGame();

  const feedback = gameWorkspace.querySelector(".game-feedback");
  feedback.className = `game-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  feedback.innerHTML = `
    <strong>${correct ? "Muito bem!" : `A resposta é ${escapeHtml(question.answer)}.`}</strong>
    <span>${escapeHtml(question.translation)}</span>
    <button class="btn${correct ? "" : " secondary"}" type="button" data-fill-next>${fillGameState.index + 1 === fillGameQuestions.length ? "Ver resultado" : "Próxima frase"}</button>
  `;
  gameWorkspace.querySelectorAll("[data-fill-answer]").forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-answer", button.dataset.fillAnswer === question.answer);
    button.classList.toggle("is-selected", button.dataset.fillAnswer === answer);
  });
  gameWorkspace.querySelector("[data-fill-next]").addEventListener("click", () => {
    fillGameState.index += 1;
    fillGameState.answered = false;
    renderFillGame();
  });
}

function renderQuickGame() {
  const question = quickGameQuestions[quickGameState.index];
  if (!question) {
    gameWorkspace.innerHTML = renderGameComplete("Rodada concluída", quickGameState.score, quickGameQuestions.length, "Repita a rodada para tentar superar sua pontuação.", "quick");
    gameWorkspace.querySelector(".game-reset").addEventListener("click", resetQuickGame);
    return;
  }

  gameWorkspace.innerHTML = `
    <div class="game-panel quick-panel">
      <div class="game-panel-copy">
        <span class="game-index">03 / 06 · escolha</span>
        <h3>Qual combina com ${escapeHtml(question.noun)}?</h3>
        <p>Responda sem consultar a tabela. A rodada tem ${quickGameQuestions.length} perguntas.</p>
        <div class="game-stats"><span><strong>${quickGameState.index + 1}</strong> / ${quickGameQuestions.length}</span><span><strong>${quickGameState.score}</strong> acertos</span></div>
      </div>
      <div class="quick-challenge">
        <div class="noun-display"><strong>${escapeHtml(question.hanzi)}</strong><span>${escapeHtml(question.pinyin)} · ${escapeHtml(question.noun)}</span></div>
        <div class="answer-options" role="group" aria-label="Escolher classificador">
          ${question.options.map((option) => `<button class="answer-option" type="button" data-quick-answer="${escapeHtml(option)}">一${escapeHtml(option)}</button>`).join("")}
        </div>
        <div class="game-feedback" aria-live="polite"></div>
      </div>
    </div>
  `;

  gameWorkspace.querySelectorAll("[data-quick-answer]").forEach((button) => {
    button.addEventListener("click", () => handleQuickAnswer(button.dataset.quickAnswer));
  });
}

function handleQuickAnswer(answer) {
  if (quickGameState.answered) return;
  quickGameState.answered = true;
  const question = quickGameQuestions[quickGameState.index];
  const correct = answer === question.answer;
  if (correct) quickGameState.score += 1;
  renderQuickGame();

  const feedback = gameWorkspace.querySelector(".game-feedback");
  feedback.className = `game-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  feedback.innerHTML = `
    <strong>${correct ? "Acertou!" : `O correto é 一${escapeHtml(question.answer)}.`}</strong>
    <span>${escapeHtml(question.hanzi)} = ${escapeHtml(question.noun)}</span>
    ${renderGameAudio(question.audioSrc, "Ouvir expressão")}
    <button class="btn${correct ? "" : " secondary"}" type="button" data-quick-next>${quickGameState.index + 1 === quickGameQuestions.length ? "Ver resultado" : "Próxima"}</button>
  `;
  gameWorkspace.querySelectorAll("[data-quick-answer]").forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-answer", button.dataset.quickAnswer === question.answer);
    button.classList.toggle("is-selected", button.dataset.quickAnswer === answer);
  });
  gameWorkspace.querySelector("[data-quick-next]").addEventListener("click", () => {
    quickGameState.index += 1;
    quickGameState.answered = false;
    renderQuickGame();
  });
}

function renderOrderGame() {
  const question = orderGameQuestions[orderGameState.index];
  if (!question) {
    gameWorkspace.innerHTML = renderGameComplete("Frases montadas", orderGameState.score, orderGameQuestions.length, "Você praticou a ordem básica de frases com classificadores.", "order");
    gameWorkspace.querySelector(".game-reset").addEventListener("click", resetOrderGame);
    return;
  }

  if (!orderGameState.tokens.length) {
    orderGameState.tokens = shuffle(question.tokens.map((text, index) => ({ text, index })));
  }

  const selectedText = orderGameState.selected.map((index) => question.tokens[index]).join("") || "Clique nas peças para montar a frase";
  gameWorkspace.innerHTML = `
    <div class="game-panel order-panel">
      <div class="game-panel-copy">
        <span class="game-index">04 / 06 · ordem</span>
        <h3>Monte a frase</h3>
        <p>Use cada peça uma vez e organize a frase em chinês. A pista em português fica aqui ao lado.</p>
        <div class="game-stats"><span><strong>${orderGameState.index + 1}</strong> / ${orderGameQuestions.length}</span><span><strong>${orderGameState.score}</strong> acertos</span></div>
      </div>
      <div class="order-challenge">
        <p class="order-prompt">${escapeHtml(question.prompt)}</p>
        <div class="order-answer${orderGameState.selected.length ? " has-tokens" : ""}">${escapeHtml(selectedText)}</div>
        <div class="token-bank" role="group" aria-label="Peças da frase">
          ${orderGameState.tokens.map((token) => `<button class="token-button${orderGameState.selected.includes(token.index) ? " is-used" : ""}" type="button" data-order-index="${token.index}" ${orderGameState.selected.includes(token.index) || orderGameState.answered ? "disabled" : ""}>${escapeHtml(token.text)}</button>`).join("")}
        </div>
        <div class="order-actions">
          <button class="btn secondary" type="button" data-order-clear>Limpar</button>
          <button class="btn" type="button" data-order-check ${orderGameState.selected.length !== question.tokens.length || orderGameState.answered ? "disabled" : ""}>Conferir</button>
        </div>
        <div class="game-feedback" aria-live="polite"></div>
      </div>
    </div>
  `;

  gameWorkspace.querySelectorAll("[data-order-index]").forEach((button) => {
    button.addEventListener("click", () => {
      orderGameState.selected.push(Number(button.dataset.orderIndex));
      renderOrderGame();
    });
  });
  gameWorkspace.querySelector("[data-order-clear]").addEventListener("click", () => {
    orderGameState.selected = [];
    renderOrderGame();
  });
  gameWorkspace.querySelector("[data-order-check]").addEventListener("click", checkOrderAnswer);
}

function checkOrderAnswer() {
  if (orderGameState.answered) return;
  const question = orderGameQuestions[orderGameState.index];
  const answer = orderGameState.selected.map((index) => question.tokens[index]).join("");
  const correct = answer === question.answer;
  orderGameState.answered = true;
  if (correct) orderGameState.score += 1;
  renderOrderGame();

  const feedback = gameWorkspace.querySelector(".game-feedback");
  feedback.className = `game-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  feedback.innerHTML = `
    <strong>${correct ? "Frase correta!" : `A ordem é ${escapeHtml(question.answer)}`}</strong>
    ${renderGameAudio(question.audioSrc, "Ouvir frase")}
    <button class="btn${correct ? "" : " secondary"}" type="button" data-order-next>${orderGameState.index + 1 === orderGameQuestions.length ? "Ver resultado" : "Próxima frase"}</button>
  `;
  gameWorkspace.querySelector("[data-order-next]").addEventListener("click", () => {
    orderGameState = { index: orderGameState.index + 1, selected: [], score: orderGameState.score, answered: false, tokens: [] };
    renderOrderGame();
  });
}

function renderTranslateGame() {
  const question = translateGameQuestions[translateGameState.index];
  if (!question) {
    gameWorkspace.innerHTML = renderGameComplete("Traduções revisadas", translateGameState.score, translateGameQuestions.length, "Você revisou classificadores dentro de frases completas.", "translate");
    gameWorkspace.querySelector(".game-reset").addEventListener("click", resetTranslateGame);
    return;
  }

  gameWorkspace.innerHTML = `
    <div class="game-panel translate-panel">
      <div class="game-panel-copy">
        <span class="game-index">05 / 06 · tradução</span>
        <h3>Traduza rápido</h3>
        <p>Leia a frase em português e escolha a versão correta em chinês.</p>
        <div class="game-stats"><span><strong>${translateGameState.index + 1}</strong> / ${translateGameQuestions.length}</span><span><strong>${translateGameState.score}</strong> acertos</span></div>
      </div>
      <div class="translation-challenge">
        <p class="translation-prompt">${escapeHtml(question.prompt)}</p>
        <div class="translation-options" role="group" aria-label="Opções de tradução">
          ${question.options.map((option) => `<button class="translation-option" type="button" data-translate-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join("")}
        </div>
        <div class="game-feedback" aria-live="polite"></div>
      </div>
    </div>
  `;

  gameWorkspace.querySelectorAll("[data-translate-answer]").forEach((button) => {
    button.addEventListener("click", () => handleTranslateAnswer(button.dataset.translateAnswer));
  });
}

function handleTranslateAnswer(answer) {
  if (translateGameState.answered) return;
  const question = translateGameQuestions[translateGameState.index];
  const correct = answer === question.answer;
  translateGameState.answered = true;
  if (correct) translateGameState.score += 1;
  renderTranslateGame();

  const feedback = gameWorkspace.querySelector(".game-feedback");
  feedback.className = `game-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  feedback.innerHTML = `
    <strong>${correct ? "Boa tradução!" : "Confira a frase correta."}</strong>
    <span>${escapeHtml(question.answer)}</span>
    ${renderGameAudio(question.audioSrc, "Ouvir frase")}
    <button class="btn${correct ? "" : " secondary"}" type="button" data-translate-next>${translateGameState.index + 1 === translateGameQuestions.length ? "Ver resultado" : "Próxima"}</button>
  `;
  gameWorkspace.querySelectorAll("[data-translate-answer]").forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-answer", button.dataset.translateAnswer === question.answer);
    button.classList.toggle("is-selected", button.dataset.translateAnswer === answer);
  });
  gameWorkspace.querySelector("[data-translate-next]").addEventListener("click", () => {
    translateGameState = { index: translateGameState.index + 1, score: translateGameState.score, answered: false };
    renderTranslateGame();
  });
}

function renderTruthGame() {
  const question = truthGameQuestions[truthGameState.index];
  if (!question) {
    gameWorkspace.innerHTML = renderGameComplete("Revisão concluída", truthGameState.score, truthGameQuestions.length, "Você conferiu usos corretos e erros comuns de classificadores.", "truth");
    gameWorkspace.querySelector(".game-reset").addEventListener("click", resetTruthGame);
    return;
  }

  gameWorkspace.innerHTML = `
    <div class="game-panel truth-panel">
      <div class="game-panel-copy">
        <span class="game-index">06 / 06 · revisão</span>
        <h3>Verdadeiro ou falso?</h3>
        <p>Leia a expressão e decida se ela combina com a tradução apresentada.</p>
        <div class="game-stats"><span><strong>${truthGameState.index + 1}</strong> / ${truthGameQuestions.length}</span><span><strong>${truthGameState.score}</strong> acertos</span></div>
      </div>
      <div class="truth-challenge">
        <p class="truth-expression">${escapeHtml(question.sentence)}</p>
        <p class="truth-translation">${escapeHtml(question.translation)}</p>
        ${renderGameAudio(question.audioSrc, "Ouvir expressão")}
        <div class="answer-options" role="group" aria-label="Responder verdadeiro ou falso">
          <button class="answer-option" type="button" data-truth-answer="true">Verdadeiro</button>
          <button class="answer-option" type="button" data-truth-answer="false">Falso</button>
        </div>
        <div class="game-feedback" aria-live="polite"></div>
      </div>
    </div>
  `;

  gameWorkspace.querySelectorAll("[data-truth-answer]").forEach((button) => {
    button.addEventListener("click", () => handleTruthAnswer(button.dataset.truthAnswer === "true"));
  });
}

function handleTruthAnswer(answer) {
  if (truthGameState.answered) return;
  const question = truthGameQuestions[truthGameState.index];
  const correct = answer === question.answer;
  truthGameState.answered = true;
  if (correct) truthGameState.score += 1;
  renderTruthGame();

  const feedback = gameWorkspace.querySelector(".game-feedback");
  feedback.className = `game-feedback ${correct ? "is-correct" : "is-incorrect"}`;
  feedback.innerHTML = `
    <strong>${correct ? "Isso!" : "Ainda não."}</strong>
    <span>${escapeHtml(question.explanation)}</span>
    <button class="btn${correct ? "" : " secondary"}" type="button" data-truth-next>${truthGameState.index + 1 === truthGameQuestions.length ? "Ver resultado" : "Próxima"}</button>
  `;
  gameWorkspace.querySelectorAll("[data-truth-answer]").forEach((button) => {
    button.disabled = true;
    button.classList.toggle("is-answer", button.dataset.truthAnswer === String(question.answer));
    button.classList.toggle("is-selected", button.dataset.truthAnswer === String(answer));
  });
  gameWorkspace.querySelector("[data-truth-next]").addEventListener("click", () => {
    truthGameState = { index: truthGameState.index + 1, score: truthGameState.score, answered: false };
    renderTruthGame();
  });
}

function renderGameComplete(title, score, total, message, game) {
  const step = { fill: "02", quick: "03", order: "04", translate: "05", truth: "06" }[game] || "03";
  return `
    <div class="game-panel game-complete">
      <span class="game-index">${step} / 06 · resultado</span>
      <div class="complete-mark">${score === total ? "满分" : `${score}/${total}`}</div>
      <h3>${escapeHtml(title)}</h3>
      <p>Você acertou <strong>${score} de ${total}</strong>. ${escapeHtml(message)}</p>
      <button class="btn game-reset" type="button">Jogar novamente</button>
    </div>
  `;
}

function resetFillGame() {
  prepareQuestionDeck(fillGameQuestions, true);
  fillGameState = { index: 0, score: 0, answered: false };
  renderFillGame();
}

function resetQuickGame() {
  prepareQuestionDeck(quickGameQuestions, true);
  quickGameState = { index: 0, score: 0, answered: false };
  renderQuickGame();
}

function resetOrderGame() {
  prepareQuestionDeck(orderGameQuestions);
  orderGameState = { index: 0, selected: [], score: 0, answered: false, tokens: [] };
  renderOrderGame();
}

function resetTranslateGame() {
  prepareQuestionDeck(translateGameQuestions, true);
  translateGameState = { index: 0, score: 0, answered: false };
  renderTranslateGame();
}

function resetTruthGame() {
  prepareQuestionDeck(truthGameQuestions);
  truthGameState = { index: 0, score: 0, answered: false };
  renderTruthGame();
}

function renderGameAudio(src, label) {
  if (!src) return "";
  return `<button class="audio-button" type="button" data-game-audio="${escapeHtml(src)}"><span aria-hidden="true">▶</span>${escapeHtml(label)}</button>`;
}

function handleGameAudioClick(event) {
  const button = event.target.closest("[data-game-audio]");
  if (!button) return;

  if (activeGameAudio) activeGameAudio.pause();
  activeGameAudio = new Audio(button.dataset.gameAudio);
  const originalLabel = button.innerHTML;
  button.classList.add("is-playing");
  button.innerHTML = `<span aria-hidden="true">■</span> Tocando…`;

  const restoreButton = () => {
    button.classList.remove("is-playing");
    button.innerHTML = originalLabel;
  };
  activeGameAudio.addEventListener("ended", restoreButton, { once: true });
  activeGameAudio.addEventListener("error", () => {
    restoreButton();
    button.innerHTML = `<span aria-hidden="true">!</span> Áudio indisponível`;
  }, { once: true });
  activeGameAudio.play().catch(restoreButton);
}

function findExamByQuery(index) {
  const slug = new URLSearchParams(window.location.search).get("exam");
  if (!slug) return null;

  return index.exams.find((exam) => {
    const pathSlug = exam.path.split("/").pop()?.replace(/\\.json$/, "");
    return exam.id === slug || pathSlug === slug || exam.path === slug;
  });
}

async function boot() {
  try {
    syncAppVersion();
    examIndex = await loadExamIndex();
    examSelect.innerHTML = [
      `<option value="">Escolha uma prova</option>`,
      ...examIndex.exams.map((exam) => `<option value="${escapeHtml(exam.path)}">${escapeHtml(exam.title)}</option>`),
    ].join("");
    renderExamCards(examIndex);

    examSelect.addEventListener("change", async () => {
      if (!examSelect.value) {
        activeExam = null;
        examScreen.hidden = true;
        homeScreen.hidden = false;
        clearExamUrl();
        homeScreen.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      await startExam(examSelect.value);
    });

    examForm.addEventListener("submit", gradeExam);

    const linkedExam = findExamByQuery(examIndex);
    if (linkedExam) {
      await startExam(linkedExam.path);
    }
  } catch (error) {
    homeScreen.innerHTML = `<div class="home-copy"><h2>Erro ao carregar</h2><p>${escapeHtml(error.message)}</p></div>`;
  }
}

if (document.body.dataset.page === "exams") boot();
if (document.body.dataset.page === "games") {
  classifierGuide.addEventListener("click", handleGameAudioClick);
  gameWorkspace.addEventListener("click", handleGameAudioClick);
  renderClassifierEducation();
  renderClassifierGames();
}
