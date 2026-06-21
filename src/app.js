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
  const response = await fetch("./exams/index.json");
  if (!response.ok) throw new Error("Nao foi possivel carregar a lista de provas.");
  return response.json();
}

async function loadExam(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Nao foi possivel carregar ${path}.`);
  return response.json();
}

function fieldName(question) {
  return `question-${question.id}`;
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
      <span class="audio-missing">Audio ainda nao adicionado.</span>
      ${question.audioText ? `<span class="audio-missing">Transcricao para estudo: ${escapeHtml(question.audioText)}</span>` : ""}
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

function renderInput(question) {
  const name = fieldName(question);

  if (question.type === "translation" || question.type === "word-order") {
    return `<textarea name="${name}" autocomplete="off" spellcheck="false" placeholder="Digite sua resposta em chines"></textarea>`;
  }

  if (question.type === "fill-blank") {
    return `<input type="text" name="${name}" autocomplete="off" placeholder="Letra ou palavra" />`;
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

function renderQuestion(question) {
  return `
    <article class="question" id="q-${question.id}" data-question-id="${question.id}">
      <div class="question-header">
        <div class="question-title">
          <h3>${escapeHtml(question.prompt)}</h3>
          ${question.help ? `<p>${escapeHtml(question.help)}</p>` : ""}
        </div>
        <span class="badge">${question.id}</span>
      </div>
      ${question.image ? renderImageLike(question.image) : ""}
      ${question.audioSrc || question.audioText ? renderAudio(question) : ""}
      ${renderWordBank(question)}
      ${question.matchOptions ? renderMatchOptions(question.matchOptions) : ""}
      ${renderInput(question)}
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

  examIntro.innerHTML = `
    <h2>${escapeHtml(exam.title)}</h2>
    <p>${escapeHtml(exam.description)}</p>
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
              <span>${section.questions.length} questoes</span>
            </div>
            ${section.instructions ? `<p class="prompt-text">${escapeHtml(section.instructions)}</p>` : ""}
            ${section.sharedWordBank ? renderSharedWordBank(section.sharedWordBank) : ""}
            ${section.sharedOptions ? renderSharedOptions(section.sharedOptions) : ""}
            ${section.questions.map(renderQuestion).join("")}
          </section>
        `,
      )
      .join("")}
    <div class="actions">
      <button class="btn secondary" type="button" id="clearBtn">Limpar respostas</button>
      <button class="btn" type="submit">Corrigir prova</button>
    </div>
  `;

  examForm.addEventListener("input", updateProgress, { once: false });
  document.querySelector("#clearBtn").addEventListener("click", clearAnswers);
  updateProgress();
}

function renderExamCards(index) {
  examCards.innerHTML = index.exams
    .map(
      (exam, position) => `
        <article class="exam-card">
          <div>
            <span class="exam-card-kicker">${escapeHtml(exam.level || `Prova ${position + 1}`)}</span>
            <h3>${escapeHtml(exam.title)}</h3>
            <p>${escapeHtml(exam.description || "Prova simulada com correcao automatica.")}</p>
          </div>
          <dl class="exam-meta">
            <div>
              <dt>Questoes</dt>
              <dd>${escapeHtml(exam.questionCount || "30")}</dd>
            </div>
            <div>
              <dt>Audio</dt>
              <dd>${escapeHtml(exam.audioCount || "10")}</dd>
            </div>
          </dl>
          <button class="btn start-exam" type="button" data-exam-path="${escapeHtml(exam.path)}">Comecar prova</button>
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
      ${question.explanation ? `<div class="explanation">${escapeHtml(question.explanation)}</div>` : ""}
      ${question.audioText ? `<div class="explanation">Audio: ${escapeHtml(question.audioText)}</div>` : ""}
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
              <span>${escapeHtml(question.prompt)}</span>
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
  if (percent >= 50) return "Voce ja tem material para estudar com foco.";
  return "Refaca com calma e compare cada resposta com o gabarito.";
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

async function boot() {
  try {
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
        return;
      }
      await startExam(examSelect.value);
    });

    examForm.addEventListener("submit", gradeExam);
  } catch (error) {
    homeScreen.innerHTML = `<div class="home-copy"><h2>Erro ao carregar</h2><p>${escapeHtml(error.message)}</p></div>`;
  }
}

boot();
