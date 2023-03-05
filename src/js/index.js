import Board from "./models/Board.js";
import GameManager from "./models/GameManager.js";
import { CELL_STATUSES } from "../constants/cellStatuses.js";
import { SMILE_STATUSES } from "../constants/smileStatuses.js";
import { splitNumber } from "./helpers/splitNumber.js";

let board;
let gameManager;
let timer;

initGame();

function initBoard(cell = null) {
    board = new Board();
    board.initBoard(cell);
    fillBoard();
}

function initGame() {
    initBoard();
    gameManager = new GameManager();
    updateMinesCounter();
    updateTimer();
    initSmile();
}

function startGame() {
    gameManager.isPlaying = true;
    timer = setInterval(updateTimer, 1000);
}

function finishGame(cell) {
    clearInterval(timer);
    gameManager.isFinished = true;
    gameManager.isPlaying = false;
    board.openCells(cell);
    if (gameManager.isWin) {
        changeSmileStatus(SMILE_STATUSES.WIN);
    } else {
        changeSmileStatus(SMILE_STATUSES.LOSE);
    }
}

function fillBoard() {
    const boardElement = document.querySelector("[data-field]");
    boardElement.innerHTML = "";
    board.field.forEach((row) =>
        row.forEach((cell) => {
            cell.element.addEventListener("click", () => handleLeftClick(cell));
            cell.element.addEventListener("contextmenu", (event) => handleRightClick(event, cell));
            cell.element.addEventListener("mousedown", (event) => handleMouseDown(event));
            cell.element.addEventListener("mouseup", handleMouseUp);
            boardElement.append(cell.element);
        })
    );
}

function handleLeftClick(cell, isClicked = true) {
    if (gameManager.isFinished) return;
    if (!gameManager.isPlaying) startGame();

    if (!board.isOpened() && cell.hasMine) {
        initBoard(cell);
        cell.hasMine = false;
    }

    cell.open(isClicked);

    if (cell.status === CELL_STATUSES.NUMBER) {
        const { cells, minesCount } = board.getNearbyCells(cell);
        if (minesCount === 0) {
            cell.status = CELL_STATUSES.EMPTY;
            cells.forEach((cell) => handleLeftClick(cell, false));
        } else {
            cell.minesCount = minesCount;
        }
    }

    if (gameManager.checkIsGameEnded(board.field)) {
        finishGame(cell);
    }
}

function handleRightClick(event, cell) {
    if (gameManager.isFinished) return;
    if (!gameManager.isPlaying) startGame();
    event.preventDefault();
    cell.changeStatus();
    updateMinesCounter();
}

function handleMouseUp() {
    if (!gameManager.isFinished) {
        changeSmileStatus(SMILE_STATUSES.UNPRESSED);
    }
}

function handleMouseDown(event) {
    if (event.button !== 2 && !gameManager.isFinished) {
        changeSmileStatus(SMILE_STATUSES.AFRAID);
    }
}

function initSmile() {
    const smile = document.querySelector("[data-smile]");
    smile.addEventListener("click", initGame);
    smile.addEventListener("mousedown", () => changeSmileStatus(SMILE_STATUSES.PRESSED));
    smile.addEventListener("mouseup", () => changeSmileStatus(SMILE_STATUSES.UNPRESSED));
}

function changeSmileStatus(status) {
    const smile = document.querySelector("[data-smile]");
    smile.dataset.smile = status;
}

function updateMinesCounter() {
    const minesCounter = document.querySelector("[data-mines-counter]");
    const counterNumbers = minesCounter.querySelectorAll("[data-number]");
    const splittedNumber = splitNumber(board.countMinesLeft());
    for (let i = 0; i < 3; i++) {
        counterNumbers[i].dataset.number = splittedNumber[i];
    }
}

function updateTimer() {
    if (gameManager.isPlaying) {
        gameManager.time++;
    }
    const timer = document.querySelector("[data-timer]");
    const counterNumbers = timer.querySelectorAll("[data-number]");
    const splittedNumber = splitNumber(gameManager.time);
    for (let i = 0; i < 3; i++) {
        counterNumbers[i].dataset.number = splittedNumber[i];
    }
}
