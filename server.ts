import express from 'express';
const app = express();
const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 8000;
//@ts-ignore
import dbConnector from './config/db';

//Connect to MongoDB
dbConnector();

//Middleware
app.use(express.json());

//Routes
app.get('/', (req, res) => res.send('Home route'));
import usersRoute from './routes/users';
app.use('/api/users', usersRoute);

//Start server listening on Production port or default to localhost:8000
app.listen(PORT, () => console.log(`server started on port:${PORT}`));


