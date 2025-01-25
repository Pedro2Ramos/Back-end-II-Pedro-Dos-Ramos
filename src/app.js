import express from 'express';
import { config } from './config/config.js';
import ordersRoutes from './routes/orders.routes.js';
import buyerRoutes from './routes/buyer.routes.js';
import businessRoutes from './routes/business.routes.js';
import DbConnection from './config/dbConnection.js'; 
import { passport } from './config/passport.js';  
import sessionsRouter from './routes/sessions.js'; 

import cors from 'cors';

const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use("/api/sessions", sessionsRouter);
app.use('/api/orders', ordersRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/buyer', buyerRoutes);


DbConnection.getInstance();

app.listen(config.port, () => console.log(`Server running on port ${config.port}`));

export default app;
