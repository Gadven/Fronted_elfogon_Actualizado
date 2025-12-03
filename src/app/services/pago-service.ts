import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GenericService } from './generic-service';
import { Pago } from '../model/pago';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PagoService extends GenericService<Pago> {
    private messageChange: Subject<string> = new Subject<string>();

    constructor() {
        super(
            inject(HttpClient),
            `${environment.HOST}/pagos`
        );
    }

    setMessageChange(data: string) {
        this.messageChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }
}
