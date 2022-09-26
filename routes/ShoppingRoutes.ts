import express from 'express';
import { GetFoodAvailability, GetTopResturant, GetFoodsIn30Min, SearchFoods, ResturantById } from '../controllers/ShoppingController';

const router = express.Router();

router.get('/:pincode', GetFoodAvailability)
router.get('/top-restaurants/:pincode', GetTopResturant)
router.get('/foods-in-30-min/:pincode', GetFoodsIn30Min);
router.get('/search/:pincode', SearchFoods)
router.get('/restaurants/:id', ResturantById)

export { router as ShoopingRoute };
