import express from 'express';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import buyerRoutes from './routes/buyerRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());


app.use('/api/buyers', buyerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
