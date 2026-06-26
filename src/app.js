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

const APP_VERSION = "2026-06-26-3";
const APP_VERSION_KEY = "chinese-test:app-version";

let activeExam = null;
let gradedAnswers = null;
let examIndex = null;

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
  window.scrollTo({ top: 0, behavior: "smooth" });
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

boot();
