import { ObjectId } from "mongodb";
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
export type Role = "ADMIN" | "USER";
export interface User {
    _id?: ObjectId;
    username: string;
    password?: string;
    role: Role
}
export interface FlashMessage {
    type: "error" | "success"
    message: string;
}