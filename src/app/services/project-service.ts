import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Project } from '../model/project';
import { GenericService } from './generic-service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends GenericService<Project> {
  constructor(){
    super(
      inject(HttpClient),
      `${environment.HOST}/projects`
    );
  }
}
