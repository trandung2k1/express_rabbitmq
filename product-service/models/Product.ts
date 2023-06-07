import { Schema, models, model } from 'mongoose';
interface ProductSchema {
    name: string;
    price: number;
    description: string;
}

const productSchema = new Schema<ProductSchema>(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const Product = models.Product || model<ProductSchema>('Product', productSchema);
export default Product;
