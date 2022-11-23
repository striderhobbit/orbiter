import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { OrbitService } from '../orbit.service';
import { SpaceEvent } from 'src/types/event';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

    constructor(public messageService: MessageService, public orbitService: OrbitService) { }

    subscription?: Subscription;

    ngOnInit(): void {
    }

    subscribe(): void {
        this.subscription = this.orbitService.subscribe({
            next: (spaceEvent: SpaceEvent) => {
                this.messageService.push(`${MessageComponent.name}: ${spaceEvent}`);
            },
            complete: () => {
                delete this.subscription;
                this.messageService.push(`${MessageComponent.name}: ${OrbitService.name} completed`);
            },
        });
    }

    unsubscribe(): void {
        this.subscription?.unsubscribe();

        delete this.subscription;
    }

}