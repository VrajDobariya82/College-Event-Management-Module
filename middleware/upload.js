const multer = require('multer');
const path = require('path');

/**
 * File Upload Middleware
 * 
 * This middleware handles file uploads for event images.
 * It uses multer to store files and validate file types.
 */

// Set up storage engine for multer
const storage = multer.diskStorage({
  // Set destination folder for uploaded files
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Set filename for uploaded files
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

// Check file type to only allow images
const fileFilter = (req, file, cb) => {
  // Allow only image files
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only images'), false);
  }
};

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB max file size
  fileFilter: fileFilter
});

module.exports = upload; 