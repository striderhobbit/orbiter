import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor() { }

    #messages: string[] = [];

    get messages(): string[] {
        return this.#messages.slice();
    }

    clear(): void {
        this.#messages.length = 0;
    }

    push(message: string): void {
        this.#messages.push(message);
    }
}