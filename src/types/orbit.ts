import { SpaceEvent } from "./event";

export class Orbit {
    constructor(...spaceEvents: SpaceEvent[]) {
        this.push(...spaceEvents);
    }

    #spaceEvents: SpaceEvent[] = [];

    get spaceEvents(): SpaceEvent[] {
        return this.#spaceEvents.slice();
    }

    push(...spaceEvents: SpaceEvent[]) {
        this.#spaceEvents.push(...spaceEvents);

        return this;
    }
}