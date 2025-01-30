import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordHostComponent } from './change-password-host.component';

describe('ChangePasswordHostComponent', () => {
  let component: ChangePasswordHostComponent;
  let fixture: ComponentFixture<ChangePasswordHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
