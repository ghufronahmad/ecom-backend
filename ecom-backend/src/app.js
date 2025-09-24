import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes/authRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import storeRoutes from './routes/storeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', routes);

// error handler
app.use((err, req, res, next) => {
console.error(err);
res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


export default app;