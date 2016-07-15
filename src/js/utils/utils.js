
export function clamp(num, min, max) {
        return num < min ? min : num > max ? max : num;
}

export function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}