const Offer = require('../models/Offer');
const Local = require('../models/Local');
const Artist = require('../models/Artist');

// Create a new Offer
const createOffer = async (req, res) => {
    const { title, description, localId, date } = req.body;
    try {
        // Ensure the local exists
        const local = await Local.findById(localId);
        if (!local) {
            return res.status(404).json({ message: "Local not found" });
        }

        const offer = new Offer({ title, description, localId, date });
        const result = await offer.save();

        res.status(201).json({ message: "Offer created", offer: result });
    } catch (err) {
        console.error("Error creating offer:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get all Offers
const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find()
            .populate('localId', 'name address country')
            .populate('artistSignups', 'name age');
        res.status(200).json({ message: "Offers retrieved", offers });
    } catch (err) {
        console.error("Error retrieving offers:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single Offer by ID
const getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id)
            .populate('localId', 'name address country')
            .populate('artistSignups', 'name age');
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        res.status(200).json(offer);
    } catch (err) {
        console.error("Error retrieving offer:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update an Offer by ID
const updateOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('localId', 'name address country')
            .populate('artistSignups', 'name age');
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        res.status(200).json({ message: "Offer updated", offer });
    } catch (err) {
        console.error("Error updating offer:", err);
        res.status(400).json({ message: err.message });
    }
};

// Delete an Offer by ID
const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findByIdAndDelete(req.params.id);
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }
        res.status(200).json({ message: "Offer deleted" });
    } catch (err) {
        console.error("Error deleting offer:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Sign up an Artist for an Offer
const signUpArtist = async (req, res) => {
    const { offerId } = req.params;
    const { artistId } = req.body;
    try {
        const offer = await Offer.findById(offerId);
        if (!offer) {
            return res.status(404).json({ message: "Offer not found" });
        }

        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        // Check if artist is already signed up
        if (offer.artistSignups.includes(artistId)) {
            return res.status(400).json({ message: "Artist already signed up for this offer" });
        }

        offer.artistSignups.push(artistId);
        await offer.save();

        res.status(200).json({ message: "Artist signed up successfully", offer });
    } catch (err) {
        console.error("Error signing up artist:", err);
        res.status(400).json({ message: err.message });
    }
};

//Get Average Ratings by Genre (from earlier task)
const getAverageRatingsByGenre = async (req, res) => {
    try {
        const result = await Offer.aggregate([
            {
                $lookup: {
                    from: 'locals', // Collection to join
                    localField: 'localId',
                    foreignField: '_id',
                    as: 'localDetails'
                }
            },
            {
                $unwind: "$localDetails"
            },
            {
                $group: {
                    _id: "$localDetails.country", // Group by country or any other field
                    averageRating: { $avg: "$ratings" } // Assuming Offers have ratings
                }
            },
            {
                $project: {
                    _id: 0,
                    country: "$_id",
                    averageRating: 1
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No offers found" });
        }

        res.status(200).json({ message: "Average ratings by country", data: result });
    } catch (err) {
        console.error("Error in aggregation:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createOffer,
    getOffers,
    getOfferById,
    updateOffer,
    deleteOffer,
    signUpArtist
};
