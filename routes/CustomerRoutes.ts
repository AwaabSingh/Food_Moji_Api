import express from 'express';
import { CustomersSignUp, CustomerLogin, CustomerVerify, RequestOtp, GetCustomerProfile, EditCustomerProfile } from '../controllers/CustomerController';
import { Authenticate } from '../middlewares';


const router = express.Router();

router.post('/signup', CustomersSignUp)
router.post('/login', CustomerLogin)

// Auth
router.use(Authenticate)

router.patch('/verify', CustomerVerify)
router.patch('/otp', RequestOtp)
router.get('/profile', GetCustomerProfile)
router.patch('/profile', EditCustomerProfile)

export { router as CustomerRoutes };
