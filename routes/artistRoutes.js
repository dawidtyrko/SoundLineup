const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createArtist, getArtists, getArtistById, updateArtist, deleteArtist, addOpinion } = require('../controllers/artistController');
const { artistValidator } = require('../middleware/artistValidator'); // Assuming you have a validator


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



module.exports = router;
