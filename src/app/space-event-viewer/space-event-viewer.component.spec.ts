import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceEventViewerComponent } from './space-event-viewer.component';

describe('SpaceEventViewerComponent', () => {
  let component: SpaceEventViewerComponent;
  let fixture: ComponentFixture<SpaceEventViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceEventViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceEventViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
