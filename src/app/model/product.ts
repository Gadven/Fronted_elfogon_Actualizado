export interface Product {
  idProduct: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  preparationTime?: number; // en minutos
}

export interface ProductCategory {
  idCategory: number;
  name: string;
  description?: string;
}