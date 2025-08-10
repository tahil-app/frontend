import { Component, OnInit } from '@angular/core';
import { CardContainer } from "../../../shared/components/card-container/card-container";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScheduleForm } from "../schedule-form/schedule-form";
import { ClassSchedule } from '../../../../core/models/class-schedule.model';
import { CommonModule } from '@angular/common';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { startOfDay, endOfDay, addDays } from 'date-fns';
import { Calendar } from '../../../shared/components/calendar/calendar';
import { CalendarProps } from '../../../shared/props/calendar.props';

@Component({
  selector: 'app-scheduls-calendar',
  imports: [
    CommonModule,
    CardContainer,
    TranslateModule,
    ScheduleForm,
    Calendar
  ],
  templateUrl: './scheduls-calendar.html',
  styleUrl: './scheduls-calendar.scss'
})
export class SchedulsCalendar implements OnInit {

  events: CalendarEvent[] = [];
  calendarConfig: CalendarProps = {};

  showDialog = false;
  schedule: ClassSchedule = {} as ClassSchedule;

  constructor(
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.setupCalendarConfig();
    
    // Listen for language changes
    this.translateService.onLangChange.subscribe(() => {
      this.loadEvents();
    });
  }

  private loadEvents(): void {
    // Simple example events with translations
    this.translateService.get([
      'calendar.mathClass'
    ]).subscribe(translations => {
      this.events = [
        {
          start: addDays(new Date(), 0),
          title: 'Today 10:00 AM - 11:00 AM',
          color: { primary: '#e3bc08', secondary: '#FDF1BA' },
        },
        {
          start: addDays(new Date(), 2),
          title: translations['calendar.mathClass'],
          color: { primary: '#e3bc08', secondary: '#FDF1BA' },
        },
        {
          start: addDays(new Date(), 2),
          title: translations['calendar.mathClass'],
          color: { primary: '#1e90ff', secondary: '#FDF1BA' },
        },
      ];
      this.setupCalendarConfig();
    });
  }

  setupCalendarConfig(): void {
    this.calendarConfig = {
      showNavigation: true,
      showViewSwitcher: true,
      defaultView: CalendarView.Month,
      events: this.events,
    };
  }

  eventClicked(event: CalendarEvent): void {
    console.log('Event clicked:', event);
  }

  onSave() {
    console.log('onSave');
    this.showDialog = false;

    // TODO : Call the API to refresh the calendar
  }

}
