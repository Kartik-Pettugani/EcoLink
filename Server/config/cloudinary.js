import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Validate environment variables early to provide a clear error message
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_URL } = process.env;

if (!CLOUDINARY_URL && (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET)) {
  console.error('\nMissing Cloudinary configuration. Set one of the following in your Server/.env:');
  console.error('  - CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>');
  console.error('  OR set all three: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  console.error('Example:');
  console.error('  CLOUDINARY_CLOUD_NAME=mycloud');
  console.error('  CLOUDINARY_API_KEY=123456789012345');
  console.error('  CLOUDINARY_API_SECRET=abcdefGhIjKlMnOpq');
  console.error('Continuing without Cloudinary configured — uploads will fail until credentials are set.');
} else {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;
