export interface IProductCreate {
    title: string,
    description: string,
    price: number,
    location: string,
    SubCategoryId: number,
    UserId: number,
    image?: string,
    is_active?: boolean
}