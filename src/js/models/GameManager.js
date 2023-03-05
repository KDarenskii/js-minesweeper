import { CELL_STATUSES } from "../../constants/cellStatuses.js";

export default class GameManager {
    time = 0;
    isPlaying = false;
    isFinished = false;
    isWin = false;
    isLose = false;

    checkIsGameEnded(field) {
        this.isLose = field.some((row) => {
            return row.some((cell) => cell.status === CELL_STATUSES.HITTED_MINE);
        });
        this.isWin = field.every((row) => {
            return row.every((cell) => {
                const status = cell.status;
                return (
                    status === CELL_STATUSES.NUMBER ||
                    status === CELL_STATUSES.EMPTY ||
                    (cell.hasMine &&
                        (status === CELL_STATUSES.HIDDEN ||
                            status === CELL_STATUSES.MARKED ||
                            status === CELL_STATUSES.SUPPOSED))
                );
            });
        });
        return this.isWin || this.isLose;
    }
}