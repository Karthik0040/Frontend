import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDoctorAppComponent } from './view-doctor-app.component';

describe('ViewDoctorAppComponent', () => {
  let component: ViewDoctorAppComponent;
  let fixture: ComponentFixture<ViewDoctorAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDoctorAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDoctorAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
