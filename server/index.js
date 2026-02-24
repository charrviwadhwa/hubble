import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import userRouter from './routes/users.js';
import societyRouter from './routes/societies.js';
import aiRoutes from './routes/ai.routes.js'

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRouter);
app.use('/api/societies', societyRouter)
app.use('/api/ai', aiRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/uploads/banners', express.static('uploads/banners'));
app.get('/', (req, res) => res.send('Hubble Backend is Orbiting!'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));