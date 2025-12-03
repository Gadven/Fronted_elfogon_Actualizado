import { Cliente } from './customer';

export class Pedido {
    idPedido?: number;
    cliente?: Cliente; // Objeto cliente completo
    estado?: string; // PENDIENTE / PREPARACION / LISTO / ENTREGADO
    total?: number;
}
