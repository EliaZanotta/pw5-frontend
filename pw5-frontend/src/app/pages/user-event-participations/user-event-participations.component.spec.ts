import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventParticipationsComponent } from './user-event-participations.component';

describe('UserEventParticipationsComponent', () => {
  let component: UserEventParticipationsComponent;
  let fixture: ComponentFixture<UserEventParticipationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEventParticipationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEventParticipationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
