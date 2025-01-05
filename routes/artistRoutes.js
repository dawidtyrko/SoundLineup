const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createArtist, getArtists, getArtistById, updateArtist, deleteArtist, addOpinion,addAudioLink,deleteAudioLink,uploadProfileImage,deleteProfileImage } = require('../controllers/artistController');
const { artistValidator } = require('../middleware/artistValidator'); // Assuming you have a validator
const upload = require('../config/multerConfig');

// Create an Artist
router.post('/', artistValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await createArtist(req, res);
});

router.post('/:id/opinion', async (req, res) => {
    const { opinion, localName, localId } = req.body;  // Extract opinion and localName from request body
    const artistId = req.params.id;

    if (!opinion || !localName || !localId) {
        return res.status(400).json({ message: "Opinion, localId and localName are required" });
    }

    try {
        const result = await addOpinion(artistId, opinion, localName, localId);
        res.status(result.status).json({ message: result.message, artist: result.artist });
    } catch (err) {
        console.error('Error adding opinion to artist:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Route to add an audio link to an artist
router.post('/:id/add-audio-link', async (req, res) => {
    const { platform, url } = req.body;
    const artistId = req.params.id;  // Get artist ID from route params

    if (!platform || !url) {
        return res.status(400).json({ message: "Platform and URL are required" });
    }

    try {
        const result = await addAudioLink(artistId, platform, url);
        res.status(result.status).json({ message: result.message, artist: result.artist });
    } catch (err) {
        console.error('Error adding audio link:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route for uploading artist's profile image
router.post('/upload/:id', upload.single('profileImage'), async (req, res) => {
    const artistId = req.params.id;  // Get artist ID from route params

    try {
        const result = await uploadProfileImage(artistId, req.file);
        res.status(result.status).json({ message: result.message, artist: result.artist });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});



router.get('/', getArtists);


router.get('/:id', getArtistById);

// Update an Artist by ID
router.put('/:id', artistValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await updateArtist(req, res);
});

// Delete an Artist by ID
router.delete('/:id', deleteArtist);
router.delete('/:id/profile-image', deleteProfileImage);
// Route to delete an audio link for a specific platform
router.delete('/:id/delete-audio-link', async (req, res) => {
    const { platform } = req.body;
    const artistId = req.params.id;  // Get artist ID from route params

    if (!platform) {
        return res.status(400).json({ message: "Platform is required" });
    }

    try {
        const result = await deleteAudioLink(artistId, platform);
        res.status(result.status).json({ message: result.message, artist: result.artist });
    } catch (err) {
        console.error('Error deleting audio link:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
