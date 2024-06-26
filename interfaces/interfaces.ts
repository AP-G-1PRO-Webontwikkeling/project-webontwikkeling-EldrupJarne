export interface Product {
  [key: string]: any;
  index: number;
  articleName: string;
  price: number;
  lastSold: string;
  imageSrc: string;
  type: Type;
  brand: string;
  infoShort: string;
  info: string;
  count: number;
  isOnCart: boolean;
  isOnWishlist: boolean;
  specifications: string[];
  reviews: Review[];
}
export interface Type {
  [key: string]: any;
  id: number;
  typeName: string;
  description: string;
  tags: string[];
  statusActive: boolean;
}
export interface Review {
  username: string;
  rating: number;
  comment: string;
}