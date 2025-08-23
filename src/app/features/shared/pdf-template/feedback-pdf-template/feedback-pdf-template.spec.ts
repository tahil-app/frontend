import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackPdfTemplate } from './feedback-pdf-template';

describe('FeedbackPdfTemplate', () => {
  let component: FeedbackPdfTemplate;
  let fixture: ComponentFixture<FeedbackPdfTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackPdfTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackPdfTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
