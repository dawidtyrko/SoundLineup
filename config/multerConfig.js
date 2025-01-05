const multer = require('multer');
const path = require('path');

// Configure multer storage options
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define where to store the uploaded file
        cb(null, 'uploads/');  // This is the folder where images will be stored
    },
    filename: (req, file, cb) => {
        // Use the original file extension and a timestamp to make the file name unique
        cb(null, Date.now() + path.extname(file.originalname));  // appends timestamp to original file extension
    }
});

// Set the file filter (optional, here we allow only image files)
const fileFilter = (req, file, cb) => {
    // Only allow images (you can add more file types here)
    if (file.mimetype.startsWith('image')) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only images are allowed!'), false); // Reject the file
    }
};

// Initialize multer with storage and file filter
const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
