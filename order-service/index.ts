import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import amqp from 'amqplib';
import connectDB from './db';
import Order from './models/Order';
const port: number = 5000;
const app: Express = express();
let channel: amqp.Channel, connection: amqp.Connection;
app.use(cors());
app.use(morgan('combined'));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
async function connectToRabbitMQ() {
    const amqpServer = 'amqp://localhost';
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('order-service-queue');
}

connectToRabbitMQ()
    .then(() => {
        channel.consume('order-service-queue', async (data: any) => {
            const rs = JSON.parse(data?.content);
            let total = 0;
            rs.forEach((item: any) => {
                total += item.price;
            });
            const newOrder = new Order({ products: rs, total });
            const savedOrder = await newOrder.save();
            channel.ack(data);
            channel.sendToQueue(
                'product-service-queue',
                Buffer.from(JSON.stringify(savedOrder['_doc'])),
            );
        });
    })
    .catch((error) => {
        if (error instanceof Error) {
            console.log(error.message);
        }
    });
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Welcome to the API orders endpoint',
    });
});

app.listen(port, async () => {
    await connectDB();
    console.log(`Server running on port http://localhost:${port}`);
}).on('error', (error) => {
    console.error(error.message);
});
