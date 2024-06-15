import express, { request, response } from 'express'
import mongoose, { model } from 'mongoose';
import { PORT, mongoDBURL } from './config.js';
import itemsRoute  from './routes/itemsRoute.js';
import companyrouter from './routes/companyrouter.js';
import cors from 'cors';

const app = express()
app.use(express.json());

app.use(cors());


app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome to Visa Chemical ');
})

app.use('/items',itemsRoute);
app.use('/company',companyrouter);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App Connected to Database');
        app.listen(PORT, () => {
            console.log(`Server is running on Port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });