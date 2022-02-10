const rows = 9;
const cols = 9;

let mat = [];

let isEdit = [];

let rowIsVis;
let colIsVis;
let blockIsVis;

let checkRowIsVis;
let checkColIsVis;
let checkBlockIsVis;

const showAns = document.querySelector(".ans");
const sudoku = document.querySelector(".sudoku .cell-con");
const newSudoku = document.querySelector(".new");
const submit = document.querySelector(".submit");

const body = document.body;
const heading = document.querySelector("h1");
const subheading = document.querySelector("h3");

function initializeIsVis() {
  rowIsVis = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  colIsVis = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  blockIsVis = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
}

function initializeIsCheckVis() {
  checkRowIsVis = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  checkColIsVis = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  checkBlockIsVis = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
}

function buildMaze() {
  mat = [];
  isEdit = [];
  for (let i = 0; i < 9; i++) {
    let currRow = [];
    let currEdit = [];

    for (let j = 0; j < 9; j++) {
      currRow.push(0);
      currEdit.push(false);
    }

    isEdit.push(currEdit);
    mat.push(currRow);
  }

  const copyMat = sudokus[Math.floor(Math.random() * sudokus.length)];
  console.log(copyMat);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let val = copyMat[i][j];
      mat[i][j] = val;

      if (val === 0) {
        isEdit[i][j] = true;
      }
    }
  }
}

for (let i = 0; i < rows; i++) {
  const row = [];
  const currRow = document.createElement("div");

  const rn = "row-" + i;

  currRow.classList.add(rn, "row");

  for (let j = 0; j < cols; j++) {
    row.push(0);
    const currCell = document.createElement("input");
    const cellNo = "cell-" + (i * cols + j);

    currCell.setAttribute("name", cellNo);
    currCell.setAttribute("type", "text");
    currCell.setAttribute("id", cellNo);
    currCell.setAttribute("maxlength", "1");

    currCell.classList.add("cell");

    if (j == 2 || j == 5) {
      currCell.classList.add("border-cell");
    }

    const cond1 =
      j >= 3 && j <= 5 && ((i >= 0 && i <= 2) || (i >= 6 && i <= 8));
    const cond2 =
      i >= 3 && i <= 5 && ((j >= 0 && j <= 2) || (j >= 6 && j <= 8));

    if (cond1 || cond2) {
      currCell.classList.add("yellow");
    } else {
      currCell.classList.add("white");
    }

    currRow.appendChild(currCell);
  }
  mat.push(row);
  sudoku.appendChild(currRow);
}

generateSudoku();

newSudoku.addEventListener("click", generateSudoku);

// Function to generate a sudoku randomly

function generateSudoku() {
  const ad = new Audio("./sounds/shuffle.mp3");
  ad.play();
  buildMaze();
  initializeIsVis();
  heading.innerText = "Welcome To Sudoku Game !";
  body.classList.remove("correct");

  showAns.classList.remove("hide");
  submit.classList.remove("hide");
  newSudoku.classList.remove("new-btn-bg");

  heading.classList.remove("heading");
  subheading.classList.remove("heading");

  fillIsVis(0);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cellNo = "cell-" + (i * cols + j);
      const cell = document.querySelector("#" + cellNo);

      if (mat[i][j] != 0) {
        cell.value = mat[i][j];
      } else {
        cell.value = "";
        cell.setAttribute("placeholder", "0");
      }

      cell.classList.remove("show-ans", "cell-correct");

      if (mat[i][j] == 0) {
        cell.disabled = false;

        cell.classList.remove("filled", "yellow-filled", "white-filled");
      } else {
        cell.disabled = true;
        if (cell.classList.contains("yellow")) {
          cell.classList.add("filled", "yellow-filled");
        } else {
          cell.classList.add("filled", "white-filled");
        }
      }
    }
  }
}

function fillIsVis(idx) {
  if (idx === 81) {
    return;
  }

  let row = Math.floor(idx / 9);
  let col = idx % 9;

  if (mat[row][col] === 0) {
    return fillIsVis(idx + 1);
  }

  const boxRow = Math.floor(row / 3);
  const boxCol = Math.floor(col / 3);

  const val = mat[row][col];

  const mask = 1 << val;

  rowIsVis[row] |= mask;

  colIsVis[col] |= mask;

  blockIsVis[boxRow][boxCol] |= mask;

  mat[row][col] = val;

  fillIsVis(idx + 1);
}

submit.addEventListener("click", handleSubmit);

function handleSubmit() {
  initializeIsCheckVis();

  if (checkAllFilled()) {
    const isCorrect = isValidSudoku(0);

    if (isCorrect) {
      // if correct, then option to select a new sudoku
      // flash green light
      // right sound
      const ad = new Audio("./sounds/yay.mp3");
      ad.play();
      heading.innerText = "Well Done !!!";
      body.classList.add("correct");
      body.classList.add("correct");
      showAns.classList.add("hide");
      submit.classList.add("hide");
      heading.classList.add("heading");
      subheading.classList.add("heading");
      newSudoku.classList.add("new-btn-bg");

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const cellNo = "cell-" + (i * cols + j);

          const cell = document.querySelector("#" + cellNo);
          cell.value = mat[i][j];
          cell.disabled = true;

          cell.classList.add("cell-correct");
        }
      }
    } else {
      // if wrong, then no option
      // flash red background
      // wrong sound
      const ad = new Audio("./sounds/wrongans.mp3");
      ad.play();
      body.classList.add("wrong");
      setTimeout(function () {
        body.classList.remove("wrong");
      }, 1000);
    }
  } else {
    const ad = new Audio("./sounds/alert.mp3");

    ad.play();
    ad.onplaying = function () {
      alert("Fill the empty cells before submmitting");
    };
  }
}

function checkAllFilled() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (mat[i][j] === 0) {
        return false;
      }
    }
  }

  return true;
}

function isValidSudoku(idx) {
  if (idx === 81) {
    return true;
  }

  let row = Math.floor(idx / 9);
  let col = idx % 9;

  const val = mat[row][col];

  const boxRow = Math.floor(row / 3);
  const boxCol = Math.floor(col / 3);

  const mask = 1 << val;

  if (
    (checkRowIsVis[row] & mask) == 0 &&
    (checkColIsVis[col] & mask) == 0 &&
    (checkBlockIsVis[boxRow][boxCol] & mask) == 0
  ) {
    checkRowIsVis[row] |= mask;

    checkColIsVis[col] |= mask;

    checkBlockIsVis[boxRow][boxCol] |= mask;
    return isValidSudoku(idx + 1);
  }

  return false;
}

const allCells = document.querySelectorAll(".cell");

for (let cell of allCells) {
  cell.addEventListener("change", handleValueStore);
}

function handleValueStore() {
  const currCell = this;
  const cell = currCell.getAttribute("id");

  const cellIdx = Number(cell.substring(5));
  const ridx = Math.floor(cellIdx / 9);
  const cidx = cellIdx % 9;

  mat[ridx][cidx] = Number(this.value);
}

showAns.addEventListener("click", handleAns);

function handleAns() {
  const con = confirm("Are you sure you want to give up ?");

  if (con) {
    generateSolution(0);
    const ad = new Audio("./sounds/ans.mp3");

    ad.onplaying = function () {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          const cellNo = "cell-" + (i * cols + j);

          const cell = document.querySelector("#" + cellNo);
          cell.value = mat[i][j];
          cell.disabled = true;

          cell.classList.add("show-ans");
        }
      }
      showAns.classList.add("hide");
      submit.classList.add("hide");
    };
    ad.play();
  }
}

function generateSolution(idx) {
  if (idx === 81) {
    return true;
  }

  let row = Math.floor(idx / 9);
  let col = idx % 9;

  const val = mat[row][col];

  const boxRow = Math.floor(row / 3);
  const boxCol = Math.floor(col / 3);

  if (!isEdit[row][col]) {
    return generateSolution(idx + 1);
  }

  for (let val = 1; val <= 9; val++) {
    let mask = 1 << val;

    if (
      (rowIsVis[row] & mask) == 0 &&
      (colIsVis[col] & mask) == 0 &&
      (blockIsVis[boxRow][boxCol] & mask) == 0
    ) {
      rowIsVis[row] |= mask;

      colIsVis[col] |= mask;

      blockIsVis[boxRow][boxCol] |= mask;

      mat[row][col] = val;

      const ans = generateSolution(idx + 1);

      if (ans) {
        return ans;
      }

      rowIsVis[row] ^= mask;
      colIsVis[col] ^= mask;
      blockIsVis[boxRow][boxCol] ^= mask;

      mat[row][col] = 0;
    }
  }

  return false;
}
