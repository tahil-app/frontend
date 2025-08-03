import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { LessonSchedule } from "../models/lesson-schedule.model";
import { ApiEndpoints } from "../consts/api-endpoints";
import { LessonScheduleLookup } from "../models/lesson-schedule-lookup.model";
import { Observable } from "rxjs";
import { LessonScheduleForm } from "../models/lesson-schedule-form.model";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class LessonScheduleService extends ApiService<LessonSchedule> {

    constructor(httpClient: HttpClient) {
        super(httpClient, ApiEndpoints.LESSON_SCHEDULES.Controller);
    }

    getLookups(): Observable<LessonScheduleLookup> {
        return this.httpClient.get<LessonScheduleLookup>(this.appURLGenerator.getEndPoint(ApiEndpoints.LESSON_SCHEDULES.Actions.Lookups));
    }

    create(schedule: LessonScheduleForm): Observable<LessonSchedule> {
        return this.httpClient.post<LessonSchedule>(this.appURLGenerator.getEndPoint(ApiEndpoints.Generic.Actions.Create), schedule);
    }

}