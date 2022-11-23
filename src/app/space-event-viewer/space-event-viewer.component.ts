import { Component, OnInit } from '@angular/core';
import { OrbitService } from '../orbit.service';
import { SpaceEvent } from 'src/types/event';
import { Subscription } from "rxjs";
import { MessageService } from '../message.service';

@Component({
    selector: 'app-space-event-viewer',
    templateUrl: './space-event-viewer.component.html',
    styleUrls: ['./space-event-viewer.component.css']
})
export class SpaceEventViewerComponent implements OnInit {

    constructor(public messageService: MessageService, public orbitService: OrbitService) { }

    subscription?: Subscription;

    spaceEvents: SpaceEvent[] = [];

    get path(): string {
        return `M${this.spaceEvents.map(({ x, y }) => `${x},${y}`).join(" L")}`;
    }

    ngOnInit(): void {
    }

    clear(): void {
        this.spaceEvents.length = 0;
    }

    subscribe(): void {
        this.clear();

        this.subscription = this.orbitService.subscribe({
            next: (spaceEvent: SpaceEvent) => {
                this.spaceEvents.push(spaceEvent);
            },
            complete: () => {
                delete this.subscription;
                this.messageService.push(`${SpaceEventViewerComponent.name}: ${OrbitService.name} completed`);
            },
        });
    }

    unsubscribe(): void {
        this.subscription?.unsubscribe();

        delete this.subscription;
    }

}