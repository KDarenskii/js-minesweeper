export const splitNumber = (number) => {
    if (number < 0) {
        if (number > -10) {
            return ["0", "-", String(-number % 10)];
        } else if (number >= -99 && number <= -10) {
            return ["-", String(Math.floor(-number / 10)), String(-number % 10)];
        } else {
            return ["-", "9", "9"];
        }
    } else {
        if (number === 0) {
            return ["0", "0", "0"];
        } else if (number < 10) {
            return ["0", "0", String(number % 10)];
        } else if (number >= 10 && number <= 99) {
            return ["0", String(Math.floor(number / 10)), String(number % 10)];
        } else if (number > 99 && number <= 999) {
            return [String(Math.floor(number / 100)), String(Math.floor((number / 10) % 10)), String(number % 10)];
        } else {
            return ["9", "9", "9"];
        }
    }
};
