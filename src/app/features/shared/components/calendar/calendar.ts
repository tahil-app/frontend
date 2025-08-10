import { Component, OnInit, Input, Output, EventEmitter, Inject, LOCALE_ID, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CalendarModule, DateAdapter, CalendarUtils, CalendarA11y, CalendarEventTitleFormatter, CalendarDateFormatter, CalendarEventAction } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { addMonths, addWeeks, addDays as addDaysFn, isSameMonth, isSameDay } from 'date-fns';
import { registerLocaleData, DatePipe } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import { CalendarProps } from '../../props/calendar.props';
import { CustomDateFormatter } from './custom-date-formatter';
import { CALENDAR_CONSTANTS } from './calendar.constants';

@Component({
  selector: 'calendar',
  imports: [
    CommonModule,
    TranslateModule,
    CalendarModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
    CalendarUtils,
    CalendarA11y,
    DatePipe,
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
    CalendarEventTitleFormatter
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar implements OnInit {

  @Input() config: CalendarProps = {};
  @Output() dayClicked = new EventEmitter<any>();
  @Output() eventClicked = new EventEmitter<CalendarEvent>();

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  activeDayIsOpen: boolean = true;


  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log('Edit', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        // this.events = this.events.filter((iEvent) => iEvent !== event);
        console.log('Delete', event);
      },
    },
  ];

  constructor(private translateService: TranslateService) {
    registerLocaleData(localeAr);

    this.translateService.onLangChange.subscribe((event) => {
      if (event.lang === 'ar') {
        setTimeout(() => this.viewDate = new Date(this.viewDate), 0);
      }
    });
  }

  ngOnInit(): void {
    if (this.config.defaultView) {
      this.view = this.config.defaultView;
    }

    if (this.config.events) {
      this.events = this.config.events;
    }

    this.translateService.onLangChange.subscribe(() => {
      if (this.config.events) {
        this.events = [...this.config.events];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && changes['config'].currentValue) {
      this.events = changes['config']?.currentValue?.events;
      this.events?.forEach(event => {
        event.actions = this.actions;
      });

      console.log('events', this.events);
    }
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  previous(): void {
    this.activeDayIsOpen = false;

    const addFn = {
      [CalendarView.Month]: addMonths,
      [CalendarView.Week]: addWeeks,
      [CalendarView.Day]: addDaysFn
    };
    this.viewDate = addFn[this.view](this.viewDate, -1);
  }

  next(): void {
    this.activeDayIsOpen = false;

    const addFn = {
      [CalendarView.Month]: addMonths,
      [CalendarView.Week]: addWeeks,
      [CalendarView.Day]: addDaysFn
    };
    this.viewDate = addFn[this.view](this.viewDate, 1);
  }

  today(): void {
    this.activeDayIsOpen = false;

    this.viewDate = new Date();
  }

  onDayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {

    if (isSameMonth(date, this.viewDate)) {

      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }

      this.viewDate = date;
    }

    this.dayClicked.emit(date);
  }

  onEventClicked(event: CalendarEvent): void {

    this.eventClicked.emit(event);
  }

  get showNavigation(): boolean {
    return this.config.showNavigation !== false;
  }

  get showViewSwitcher(): boolean {
    return this.config.showViewSwitcher !== false;
  }

  getMonthViewTitle(): string {
    const lang = this.translateService.currentLang?.toLowerCase() || 'en';
    const monthIndex = this.viewDate.getMonth();
    const monthName = CALENDAR_CONSTANTS.monthNames[lang === 'ar' ? 'ar' : 'en'][monthIndex];
    return `${monthName} ${this.viewDate.getFullYear()}`;
  }

  getDayViewTitle(): string {
    const lang = this.translateService.currentLang?.toLowerCase() || 'en';
    const dayIndex = this.viewDate.getDay();
    const monthIndex = this.viewDate.getMonth();

    const dayName = CALENDAR_CONSTANTS.fullDayNames[lang === 'ar' ? 'ar' : 'en'][dayIndex];
    const monthName = CALENDAR_CONSTANTS.fullMonthNames[lang === 'ar' ? 'ar' : 'en'][monthIndex];
    const day = this.viewDate.getDate();
    const year = this.viewDate.getFullYear();

    return lang === 'ar'
      ? `${dayName}، ${day} ${monthName} ${year}`
      : `${dayName}, ${monthName} ${day}, ${year}`;
  }
}
