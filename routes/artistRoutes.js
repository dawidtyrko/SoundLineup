const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { addRating,changePassword,createArtist, getArtists, getArtistById, updateArtist, deleteArtist, addOpinion,addAudioLink,deleteAudioLink,uploadProfileImage,deleteProfileImage, loginArtist } = require('../controllers/artistController');
const  {artistValidator}  = require('../middleware/artistValidator'); // Assuming you have a validator
const upload = require('../config/multerConfig');
const {passwordValidation} = require("../middleware/passwordValidator");
const validateRequest = require('../middleware/validateRequest');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/login',loginArtist)

router.post('/', artistValidator,passwordValidation,validateRequest, createArtist);

router.post('/:id/rating',authenticateToken,addRating)
router.post('/:id/opinion',authenticateToken,addOpinion)

// Route to add an audio link to an artist
router.post('/:id/add-audio-link',authenticateToken, async (req, res) => {
    const { platform, url } = req.body;
    const artistId = req.params.id;

    if (!platform || !url) {
        return res.status(400).json({ message: "Platform and URL are required" });
    }

    try {
        const result = await addAudioLink(artistId, platform, url);
        res.status(result.status).json({ message: result.message, user: result.artist });
    } catch (err) {
        console.error('Error adding audio link:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route for uploading artist's profile image
router.post('/upload/:id',authenticateToken, upload.single('profileImage'), async (req, res) => {
    const artistId = req.params.id;  // Get artist ID from route params

    try {
        const result = await uploadProfileImage(artistId, req.file);
        res.status(result.status).json({ message: result.message, user: result.user });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});



router.get('/',authenticateToken, getArtists);


router.get('/:id',authenticateToken, getArtistById);

// Update an Artist by ID
router.put('/:id',authenticateToken, artistValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await updateArtist(req, res);
});
router.put('/:id/change-password',authenticateToken,passwordValidation, changePassword);


router.delete('/:id',authenticateToken, deleteArtist);
router.delete('/:id/profile-image',authenticateToken, deleteProfileImage);
// Route to delete an audio link for a specific platform
router.delete('/:id/delete-audio-link',authenticateToken, async (req, res) => {
    const { platform } = req.body;
    const artistId = req.params.id;

    if (!platform) {
        return res.status(400).json({ message: "Platform is required" });
    }

    try {
        const result = await deleteAudioLink(artistId, platform);
        res.status(result.status).json({ message: result.message, user: result.artist });
    } catch (err) {
        console.error('Error deleting audio link:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
