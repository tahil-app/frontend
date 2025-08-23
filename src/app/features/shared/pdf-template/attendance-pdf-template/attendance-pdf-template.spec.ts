import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancePdfTemplate } from './attendance-pdf-template';

describe('AttendancePdfTemplate', () => {
  let component: AttendancePdfTemplate;
  let fixture: ComponentFixture<AttendancePdfTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendancePdfTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendancePdfTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
