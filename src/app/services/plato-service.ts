import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Plato } from '../model/plato';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';

@Injectable({
  providedIn: 'root'
})

export class PlatoService extends GenericService<Plato> {
  private platoChange: Subject<Plato[]> = new Subject<Plato[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(){
    super(
      inject(HttpClient),
      `${environment.HOST}/platos`
    );
  }
  
  //////////////////////////
  setPlatoChange(data: Plato[]){
    this.platoChange.next(data);
  }

  getPlatoChange(){
    return this.platoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}