import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/index.js';
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);

// error handler
app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


export default app;