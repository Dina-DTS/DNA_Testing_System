// src/modules/middleware/uploadMiddleware.js

import multer from 'multer';

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

export default upload;
