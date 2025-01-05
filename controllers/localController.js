const Local = require('../models/Local');
const Offer = require('../models/Offer');

// Create a new Local
const createLocal = async (req, res) => {
    const { name, address, country } = req.body;
    try {
        const local = new Local({ name, address, country });
        const result = await local.save();
        res.status(201).json({ message: "Local created", local: result });
    } catch (err) {
        console.error("Error creating local:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get all Locals
const getLocals = async (req, res) => {
    try {
        const locals = await Local.find();
        res.status(200).json({ message: "Locals retrieved", locals });
    } catch (err) {
        console.error("Error retrieving locals:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single Local by ID
const getLocalById = async (req, res) => {
    try {
        const local = await Local.findById(req.params.id);
        if (!local) {
            return res.status(404).json({ message: "Local not found" });
        }
        res.status(200).json(local);
    } catch (err) {
        console.error("Error retrieving local:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update a Local by ID
const updateLocal = async (req, res) => {
    try {
        const local = await Local.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!local) {
            return res.status(404).json({ message: "Local not found" });
        }
        res.status(200).json({ message: "Local updated", local });
    } catch (err) {
        console.error("Error updating local:", err);
        res.status(400).json({ message: err.message });
    }
};

// Delete a Local by ID
const deleteLocal = async (req, res) => {
    try {
        const local = await Local.findByIdAndDelete(req.params.id);
        if (!local) {
            return res.status(404).json({ message: "Local not found" });
        }

        // Optionally, delete all offers associated with this local
        await Offer.deleteMany({ localId: local._id });

        res.status(200).json({ message: "Local and associated offers deleted" });
    } catch (err) {
        console.error("Error deleting local:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
const addLocalOpinion = async (localId, opinion, artistName,artistId) => {
    try {
       const local = await Local.findById(localId);
       if (!local) {
           console.error('Local not found');
           return { message: "Local not found", status: 404 };
       }
        const existingOpinion = local.opinions.find(op => op.artistId === artistId);
        if (existingOpinion) {
            console.error('Opinion from this artist already exists');
            return { message: 'Opinion from this artist already exists', status: 400 };
        }

        local.opinions.push({ opinion, artistName, artistId });
        const updatedLocal = await local.save();

        console.log('Updated local:', updatedLocal);
        return {message: 'Local updated',status:201, local: updatedLocal};
    } catch (err) {
        console.error('Error adding opinion to Local:', err);
        return { message: 'Internal server error', status: 500 };

    }
};

module.exports = {
    createLocal,
    getLocals,
    getLocalById,
    updateLocal,
    deleteLocal,
    addLocalOpinion
};
