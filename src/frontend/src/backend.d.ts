import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type OrderId = bigint;
export interface UserProfile {
    name: string;
    role: UserRole;
}
export type Time = bigint;
export interface Order {
    id: OrderId;
    status: OrderStatus;
    orderDate: Time;
    buyer: Principal;
    product: ProductId;
}
export type ReviewId = bigint;
export type ProductId = bigint;
export interface Review {
    id: ReviewId;
    comment: string;
    buyer: Principal;
    rating: bigint;
    product: ProductId;
}
export interface Product {
    id: ProductId;
    name: string;
    description: string;
    quantity: bigint;
    image: ExternalBlob;
    price: bigint;
    farmer: Principal;
}
export enum OrderStatus {
    pending = "pending",
    delivered = "delivered",
    accepted = "accepted"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminGetAllOrders(): Promise<Array<Order>>;
    adminGetAllProducts(): Promise<Array<Product>>;
    adminGetAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(name: string, price: bigint, quantity: bigint, description: string, image: ExternalBlob): Promise<ProductId>;
    createReview(productId: ProductId, rating: bigint, comment: string): Promise<ReviewId>;
    deleteFiles(blobIds: Array<string>): Promise<void>;
    deleteProduct(productId: ProductId): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrdersByBuyer(buyer: Principal): Promise<Array<Order>>;
    getOrdersByFarmer(): Promise<Array<Order>>;
    getProductsByFarmer(farmer: Principal): Promise<Array<Product>>;
    getProductsByPriceRange(minPrice: bigint, maxPrice: bigint): Promise<Array<Product>>;
    getReviewsByProduct(productId: ProductId): Promise<Array<Review>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(productId: ProductId): Promise<OrderId>;
    saveCallerUserProfile(name: string): Promise<void>;
    updateOrderStatus(orderId: OrderId, newStatus: OrderStatus): Promise<void>;
    updateProduct(productId: ProductId, name: string, price: bigint, quantity: bigint, description: string, image: ExternalBlob): Promise<void>;
}
