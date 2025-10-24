import express from 'express';
import upload, { uploadToCloudinary } from '../middlewares/upload.js';
import { uploadImages, deleteImage } from '../controllers/upload.controllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router = express.Router();

// Upload multiple images
router.post('/images', isAuth, upload.array('images', 5), uploadImages);

// Delete image
router.delete('/images/:publicId', isAuth, deleteImage);

export default router;
