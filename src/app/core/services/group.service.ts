import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../consts/api-endpoints';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root',
  deps: [HttpClient]
})
export class GroupService extends ApiService<Group> {

  constructor(httpClient: HttpClient) {
    super(httpClient, ApiEndpoints.GROUPS.Controller);
  }

}