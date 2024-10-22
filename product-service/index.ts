import 'dotenv/config'
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import productRouter from './routes';
import connectDB from './db';
const port: number = 4000;
const app: Express = express();
app.use(cors());
app.use(morgan('combined'));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.get('/', (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Welcome to the API products endpoint',
    });
});
app.use('/products', productRouter);
app.listen(port, async () => {
    await connectDB();
    console.log(`Server running on port http://localhost:${port}`);
}).on('error', (error) => {
    console.error(error.message);
});
