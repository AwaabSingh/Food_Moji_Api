import express, { Application } from 'express';
import path from 'path';
import dotenv from 'dotenv'

// Routes
import { AdminRoutes, ShoopingRoute, VendorRoutes, CustomerRoutes } from '../routes';
import connectDB from '../config/db';

export default async( app: Application) => {
    // const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    dotenv.config()

    const imagePath = path.join(__dirname, '../images');

    app.use('/images', express.static(imagePath));

    app.use('/api/admin', AdminRoutes);
    app.use('/api/vendor', VendorRoutes);
    app.use('/api/customer' , CustomerRoutes)
    app.use('/api',ShoopingRoute)

   return app

}