import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventsBookingComponent } from './user-events-booking.component';

describe('UserEventsBookingComponent', () => {
  let component: UserEventsBookingComponent;
  let fixture: ComponentFixture<UserEventsBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEventsBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEventsBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
