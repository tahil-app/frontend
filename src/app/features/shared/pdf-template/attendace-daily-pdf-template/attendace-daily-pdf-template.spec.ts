import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendaceDailyPdfTemplate } from './attendace-daily-pdf-template';

describe('AttendaceDailyPdfTemplate', () => {
  let component: AttendaceDailyPdfTemplate;
  let fixture: ComponentFixture<AttendaceDailyPdfTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendaceDailyPdfTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendaceDailyPdfTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
