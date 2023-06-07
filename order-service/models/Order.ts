import { Schema, models, model } from 'mongoose';
interface OrderSchema {
    products: { product_id: string }[];
    total: number;
}
const orderSchema = new Schema<OrderSchema>(
    {
        products: [{}],
        total: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true },
);

const Order = models.Order || model<OrderSchema>('Order', orderSchema);

export default Order;
