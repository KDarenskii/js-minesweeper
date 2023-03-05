import { CELL_STATUSES } from "../../constants/cellStatuses.js";
import { getRandomNumberInRange } from "../helpers/getRandomNumberInRange.js";
import Cell from "./Cell.js";

export default class Board {
    #boardSize = 16;
    field = [];
    #minesNumber = 40;
    #minesPositions = [];

    initBoard(cell = null) {
        this.#clear();

        do {
            this.#generateMines();
        } while (cell && this.#minesPositions.some((pos) => this.#isCellsMatching(cell, pos)));

        for (let x = 0; x < this.#boardSize; x++) {
            const row = [];
            for (let y = 0; y < this.#boardSize; y++) {
                const hasMine = this.#minesPositions.some((pos) => this.#isCellsMatching(pos, { x, y }));
                const cellElement = document.createElement("div");
                cellElement.dataset.status = CELL_STATUSES.HIDDEN;
                cellElement.classList.add("cell");
                const currentCell = new Cell(x, y, hasMine, cellElement);
                if (cell && this.#isCellsMatching(cell, currentCell)) {
                    row.push(cell);
                } else {
                    row.push(currentCell);
                }
            }
            this.field.push(row);
        }
    }

    #generateMines() {
        while (this.#minesNumber > this.#minesPositions.length) {
            const newCoord = {
                x: getRandomNumberInRange(this.#boardSize),
                y: getRandomNumberInRange(this.#boardSize),
            };
            if (!this.#minesPositions.find((coord) => coord.x === newCoord.x && coord.y === newCoord.y)) {
                this.#minesPositions.push(newCoord);
            }
        }
    }

    getNearbyCells(cell) {
        const cells = [];
        let minesCount = 0;
        for (let nearX = -1; nearX < 2; nearX++) {
            for (let nearY = -1; nearY < 2; nearY++) {
                const nearCell = this.field[cell.x + nearX]?.[cell.y + nearY];
                if (nearCell) {
                    cells.push(nearCell);
                    if (nearCell.hasMine) {
                        minesCount++;
                    }
                }
            }
        }
        return { cells, minesCount };
    }

    openCells(cell) {
        this.field.forEach((row) =>
            row.forEach((currentCell) => {
                const status = currentCell.status;
                const hasMine = currentCell.hasMine;

                if (hasMine && this.#isCellsMatching(currentCell, cell)) {
                    currentCell.status = CELL_STATUSES.HITTED_MINE;
                } else if (hasMine && status !== CELL_STATUSES.MARKED && status !== CELL_STATUSES.SUPPOSED) {
                    currentCell.status = CELL_STATUSES.MINE;
                } else if (!hasMine && status === CELL_STATUSES.MARKED) {
                    currentCell.status = CELL_STATUSES.MISSED;
                } else if (!hasMine && status === CELL_STATUSES.SUPPOSED) {
                    currentCell.status = CELL_STATUSES.MISSED_SUPPOSED;
                }
            })
        );
    }

    isOpened() {
        return this.field.some((row) => row.some((cell) => cell.status !== CELL_STATUSES.HIDDEN));
    }

    countMinesLeft() {
        const minesCount = this.field.reduce((counter, row) => {
            return counter + row.filter((cell) => cell.status === CELL_STATUSES.MARKED).length;
        }, 0);
        return this.#minesNumber - minesCount;
    }

    #isCellsMatching(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    #clear() {
        this.field = [];
        this.#minesPositions = [];
    }

    get boardSize() {
        return this.#boardSize;
    }

    get minesNumber() {
        return this.#minesNumber;
    }
}
