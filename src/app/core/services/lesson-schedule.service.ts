import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { LessonSchedule } from "../models/lesson-schedule.model";
import { ApiEndpoints } from "../consts/api-endpoints";

@Injectable({
    providedIn: 'root',
    deps: [HttpClient]
})
export class LessonScheduleService extends ApiService<LessonSchedule> {

    constructor(httpClient: HttpClient) {
        super(httpClient, ApiEndpoints.LESSON_SCHEDULES.Controller);
    }

}