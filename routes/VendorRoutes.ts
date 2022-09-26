import express, { Request, Response, NextFunction } from 'express';
import { VendorLogin } from '../controllers';
import { Authenticate } from '../middlewares';
// import { }, GetFoods } from '../controllers/VendorController';
import {
  GetVendorProfile,
  UpdateVendorProfile,
  UpdateVendorService,
  AddFood,
  GetFoods,
  UpdateVendorCoverImage,
} from '../controllers';
import multer from 'multer';

const router = express.Router();

// Multer Configurations
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '_' + file.originalname);
  },
});

const images = multer({ storage: imageStorage }).array('images', 10);

router.post('/login', VendorLogin);

router.use(Authenticate);
router.get('/profile', GetVendorProfile);
router.patch('/profile', UpdateVendorProfile);
router.patch('/coverimage', images, UpdateVendorCoverImage);
router.patch('/service', UpdateVendorService);
router.post('/food', images, AddFood);
router.get('/foods', GetFoods);

export { router as VendorRoutes };
