import express, { Request, Response, NextFunction } from  'express';
import { CreateVendor, GetVendors, GetVendorById } from '../controllers';


const router = express.Router()

router.post('/vendor', CreateVendor)
router.get('/vendors', GetVendors)
router.get('/vendor/:id', GetVendorById)

router.get('/', (req: Request, res:Response, next:NextFunction) => {
    res.status(200).json({
        message: 'Hello from admin routes'
    })
})



export { router as AdminRoutes}