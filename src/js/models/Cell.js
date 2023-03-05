import { CELL_STATUSES } from "../../constants/cellStatuses.js";

export default class Cell {
    hasMine;
    element;
    #x;
    #y;

    constructor(x, y, hasMine, element) {
        this.#x = x;
        this.#y = y;
        this.hasMine = hasMine;
        this.element = element;
    }

    changeStatus() {
        if (this.status === CELL_STATUSES.EMPTY) return;

        if (this.status === CELL_STATUSES.HIDDEN) {
            this.status = CELL_STATUSES.MARKED;
        } else if (this.status === CELL_STATUSES.MARKED) {
            this.status = CELL_STATUSES.SUPPOSED;
        } else if (this.status === CELL_STATUSES.SUPPOSED) {
            this.status = CELL_STATUSES.HIDDEN;
        }
    }

    open(isClicked) {
        if (this.status !== CELL_STATUSES.HIDDEN) return;

        if (this.hasMine && isClicked) {
            this.status = CELL_STATUSES.HITTED_MINE;
        } else if (this.hasMine) {
            this.status = CELL_STATUSES.HIDDEN;
        } else {
            this.status = CELL_STATUSES.NUMBER;
        }
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get status() {
        return this.element.dataset.status;
    }

    set status(status) {
        this.element.dataset.status = status;
    }

    set minesCount(count) {
        this.element.dataset.number = count;
    }
}
