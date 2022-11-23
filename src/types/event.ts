export interface Event {
    t: number;
};

export class SpaceEvent implements Event {
    #x: number;
    #y: number;
    #t: number;

    constructor(x: number, y: number, t: number) {
        this.#x = x;
        this.#y = y;
        this.#t = t;
    }

    get x(): number {
        return this.#x;
    }

    get y(): number {
        return this.#y;
    }

    get t(): number {
        return this.#t;
    }

    toString(): string {
        return `${SpaceEvent.name}(x=${this.x}, y=${this.y}; t=${this.t}ms)`;
    }
};