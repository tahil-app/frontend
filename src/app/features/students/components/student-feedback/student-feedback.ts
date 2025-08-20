import { Component, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TranslateModule } from '@ngx-translate/core';
import { Feedback } from '../../../../core/models/feedback.model';
import { CardFeedback } from "../../../shared/components/card-feedback/card-feedback";

@Component({
  selector: 'student-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    RatingModule,
    BadgeModule,
    ButtonModule,
    ProgressSpinnerModule,
    TranslateModule,
    CardFeedback
],
  templateUrl: './student-feedback.html',
  styleUrl: './student-feedback.scss'
})
export class StudentFeedback {
  
  @Input() feedbacks: Feedback[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feedbacks']) {
      this.feedbacks = changes['feedbacks'].currentValue ?? [];
      this.feedbacks = this.feedbacks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  }


}
