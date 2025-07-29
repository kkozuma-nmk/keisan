let problems = [];
let currentProblem = null;

const unitSelect = document.getElementById("unit-select");
const problemArea = document.getElementById("problem-area");
const answerInput = document.getElementById("answer-input");
const checkButton = document.getElementById("check-button");
const nextButton = document.getElementById("next-button");
const resultDiv = document.getElementById("result");

// CSVファイルの読み込み（GitHub Pages上のCSVパス）
const CSV_URL = "problems.csv";  // 同じリポジトリに置く

function loadCSV(callback) {
  Papa.parse(CSV_URL, {
    download: true,
    header: true,
    complete: function(results) {
      problems = results.data;
      callback();
    }
  });
}

function filterProblemsByUnit(unit) {
  return problems.filter(p => p["単元"] === unit);
}

function showRandomProblem() {
  const unit = unitSelect.value;
  const unitProblems = filterProblemsByUnit(unit);
  if (unitProblems.length === 0) {
    problemArea.textContent = "問題が見つかりません";
    return;
  }
  const randIndex = Math.floor(Math.random() * unitProblems.length);
  currentProblem = unitProblems[randIndex];
  problemArea.textContent = `\\(${currentProblem.問題}\\)`;
  MathJax.typesetPromise(); // LaTeX再描画
  answerInput.value = "";
  resultDiv.textContent = "";
  nextButton.disabled = true;
  nextButton.classList.remove("ready");
}

checkButton.addEventListener("click", () => {
  const userAnswer = answerInput.value.trim();
  const correct = currentProblem.答え.trim();
  if (userAnswer === correct) {
    resultDiv.textContent = "○ 正解！";
    resultDiv.style.color = "green";
  } else {
    resultDiv.textContent = `✕ 不正解... 正解は ${correct}`;
    resultDiv.style.color = "red";
  }
  nextButton.disabled = false;
  nextButton.classList.add("ready");
});

nextButton.addEventListener("click", () => {
  showRandomProblem();
});

unitSelect.addEventListener("change", () => {
  showRandomProblem();
});

// 初期化
loadCSV(() => {
  showRandomProblem();
});

// problems = [
//   { "単元": "展開", "問題": "(x+3)(x-2)", "答え": "x^2+x-6" },
//   { "単元": "因数分解", "問題": "x^2-9", "答え": "(x+3)(x-3)" },
//   { "単元": "平方根", "問題": "√18+√8", "答え": "5√2" }
// ];

// showRandomProblem();
