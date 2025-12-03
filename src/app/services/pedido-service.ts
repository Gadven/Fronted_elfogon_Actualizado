import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GenericService } from './generic-service';
import { Pedido } from '../model/pedido';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PedidoService extends GenericService<Pedido> {
    private messageChange: Subject<string> = new Subject<string>();

    constructor() {
        super(
            inject(HttpClient),
            `${environment.HOST}/pedidos`
        );
    }

    setMessageChange(data: string) {
        this.messageChange.next(data);
    }

    getMessageChange() {
        return this.messageChange.asObservable();
    }
}
