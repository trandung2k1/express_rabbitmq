import { Router, Request, Response } from 'express';
import amqp from 'amqplib';
import Product from '../models/Product';
const router = Router();
let order: any, connection: amqp.Connection, channel: amqp.Channel;
async function connectToRabbitMQ() {
    const amqpServer = 'amqp://localhost';
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('product-service-queue');
}
connectToRabbitMQ();
router.post('/', async (req: Request, res: Response) => {
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }
    try {
        const newProduct = new Product({ name, price, description });
        const savedProduct = await newProduct.save();
        return res.status(201).json(savedProduct._doc);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
router.post('/buy', async (req: Request, res: Response) => {
    const { productIds }: any = req.body;
    try {
        const products = await Product.find({ _id: { $in: productIds } });
        channel.sendToQueue('order-service-queue', Buffer.from(JSON.stringify(products)));
        channel.consume('product-service-queue', (data: any) => {
            console.log('Consumed from product-service-queue');
            order = JSON.parse(data.content);
            if (order._id) {
                console.log(order)
                channel.ack(data);
            } else {
                return;
            }
        });

        return res.status(200).json({
            message: 'Sent to order-service success',
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }
    }
});
export default router;
