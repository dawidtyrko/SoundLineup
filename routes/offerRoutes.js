// /routes/offerRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    createOffer,
    getOffers,
    getOfferById,
    updateOffer,
    deleteOffer,
    signUpArtist,
    getAverageRatingsByGenre
} = require('../controllers/offerController');
const { offerValidator } = require('../middleware/offerValidator'); // Assuming you have a validator

// Create an Offer
router.post('/', offerValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await createOffer(req, res);
});

// Get all Offers
router.get('/', getOffers);

// Get a single Offer by ID
router.get('/:id', getOfferById);

// Update an Offer by ID
router.put('/:id', offerValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await updateOffer(req, res);
});

// Delete an Offer by ID
router.delete('/:id', deleteOffer);

// Sign up an Artist for an Offer
router.post('/:offerId/signup', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await signUpArtist(req, res);
});

// Get Average Ratings by Genre (Optional: Adjust based on your actual data)
//router.get('/aggregate/average-ratings', getAverageRatingsByGenre);

module.exports = router;
