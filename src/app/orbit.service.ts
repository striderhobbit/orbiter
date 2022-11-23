import { Event, SpaceEvent } from 'src/types/event';
import { Injectable } from '@angular/core';
import { invokeMap } from 'lodash';
import { Observable, Observer, Subscription } from "rxjs";
import { Orbit } from 'src/types/orbit';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class OrbitService {

    constructor(public messageService: MessageService) { }

    #observable: Observable<SpaceEvent> = new Observable(
        this.multicastSubscriber<SpaceEvent>(new Orbit(
            new SpaceEvent(50, 50, 1e3),
            new SpaceEvent(50, 75, 1e3),
            new SpaceEvent(75, 50, 1e3),
            new SpaceEvent(50, 25, 1e3),
            new SpaceEvent(25, 50, 1e3),
            new SpaceEvent(50, 75, 1e3),
            new SpaceEvent(50, 50, 1e3),
        ).spaceEvents)
    );

    subscribe(observer: Partial<Observer<SpaceEvent>>): Subscription {
        return this.#observable.subscribe(observer);
    }

    private multicastSubscriber<TEvent extends Event>(events: TEvent[]) {       // TODO without messageService this could be static
        const observers: Set<Observer<TEvent>> = new Set();

        const eventProcessor = new EventProcessor<TEvent>({
            complete: () =>
                invokeMap([...observers], "complete"),
            error: (err: any) =>
                invokeMap([...observers], "error", err),
            next: (value: TEvent) =>
                invokeMap([...observers], "next", value),
        });

        const eventProcessorRunner = eventProcessor.connect(new EventProcessorRunner());

        return (observer: Observer<TEvent>) => {
            observers.add(observer);

            this.messageService.push(`${OrbitService.name}: observer #${observers.size} subscribed`);

            if (observers.size === 1) {
                eventProcessorRunner.run(events)!
                    .then(() => this.messageService.push(`${OrbitService.name}: ${EventProcessorRunner.name} done`))
                    .catch(() => this.messageService.push(`${OrbitService.name}: ${EventProcessorRunner.name} canceled`));
            }

            return {
                unsubscribe: () => {
                    observers.delete(observer);

                    this.messageService.push(`${OrbitService.name}: observer unsubscribed; ${observers.size} observer(s) left`);

                    if (!observers.size) {
                        eventProcessorRunner.cancel();
                    }
                },
            };
        };
    }

}

class EventProcessor<TEvent extends Event> {
    #observer: Observer<TEvent>;

    constructor(observer: Observer<TEvent>) {
        this.#observer = observer;
    }

    connect(eventProcessorRunner: EventProcessorRunner<TEvent>): EventProcessorRunner<TEvent> {
        return eventProcessorRunner.connect(this.#observer);
    }
}

class EventProcessorRunner<TEvent extends Event> {
    #observer?: Observer<TEvent>;

    connect(observer: Observer<TEvent>): EventProcessorRunner<TEvent> {
        this.#observer = observer;

        return this;
    }

    #cancelCallback?: () => void;

    cancel(): void {
        this.#cancelCallback?.call(this);
    }

    run(events: TEvent[]): Promise<void> | undefined {
        if (this.#observer == null) {
            console.warn(`${EventProcessorRunner.name} is not connected to any observer`);

            return;
        }

        return new Promise(async (resolve, reject) => {
            for (const event of events) try {
                await new Promise<void>((resolveEvent, rejectEvent) => {
                    const timeoutId = setTimeout(() => {
                        this.#observer!.next(event);

                        resolveEvent();
                    }, event.t);

                    this.#cancelCallback = function () {
                        clearTimeout(timeoutId);

                        rejectEvent();
                    };
                });
            } catch (err) { return reject(); }

            this.#observer!.complete();

            resolve();
        });
    }
}