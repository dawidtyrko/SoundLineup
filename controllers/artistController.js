const Artist = require('../models/Artist');
const Group = require('../models/Group');



const createArtist = async (req, res) => {
    const { name, age, groupId } = req.body;
    try {
        // ensure that group exists
        if (groupId) {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
        }



        const artist = new Artist({ name, age, groupId });
        const result = await artist.save();

        // If artist is assigned to a group, add them to the group's members
        if (groupId) {
            await Group.findByIdAndUpdate(groupId, { $push: { members: result._id } });
        }

        res.status(201).json({ message: "Artist created", artist: result });
    } catch (err) {
        console.error("Error creating artist:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get all Artists
const getArtists = async (req, res) => {
    try {
        const artists = await Artist.find()
            .populate('groupId', 'name') // Populate group name
        res.status(200).json({ message: "Artists retrieved", artists });
    } catch (err) {
        console.error("Error retrieving artists:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single Artist by ID
const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id)
            .populate('groupId', 'name')
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }
        res.status(200).json(artist);
    } catch (err) {
        console.error("Error retrieving artist:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update an Artist by ID
const updateArtist = async (req, res) => {
    const { groupId } = req.body;
    try {
        // If groupId is being updated, ensure the new group exists
        if (groupId) {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
        }

        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.status(200).json({ message: "Artist updated", artist });
    } catch (err) {
        console.error("Error updating artist:", err);
        res.status(400).json({ message: err.message });
    }
};

// const addOpinion = async (artistId, opinion, localName,localId) => {
//     try {
//         const result = await Artist.findByIdAndUpdate(
//             artistId,
//             { $push: { opinions: { opinion, localName,localId } } }, // Add the opinion object to the array
//             { new: true } // Return the updated document
//         );
//         console.log('Updated Artist:', result);
//     } catch (err) {
//         console.error('Error adding opinion:', err);
//     }
// };

const addOpinion = async (artistId, opinion, localName, localId) => {
    try {
        // Find the artist first to check for existing opinions
        const artist = await Artist.findById(artistId);
        if (!artist) {
            console.error('Artist not found');
            return { message: 'Artist not found', status: 404 };
        }

        // Check if an opinion from the same localId already exists
        const existingOpinion = artist.opinions.find(op => op.localId === localId);
        if (existingOpinion) {
            console.error('Opinion from this local already exists');
            return { message: 'Opinion from this local already exists', status: 400 };
        }

        // Add the new opinion
        artist.opinions.push({ opinion, localName, localId });
        const updatedArtist = await artist.save();

        console.log('Updated Artist:', updatedArtist);
        return { message: 'Opinion added successfully', status: 201, artist: updatedArtist };
    } catch (err) {
        console.error('Error adding opinion:', err);
        return { message: 'Internal server error', status: 500 };
    }
};


// Delete an Artist by ID
const deleteArtist = async (req, res) => {
    try {
        const artist = await Artist.findByIdAndDelete(req.params.id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        // If artist was part of a group, remove them from the group's members
        if (artist.groupId) {
            await Group.findByIdAndUpdate(artist.groupId, { $pull: { members: artist._id } });
        }

        res.status(200).json({ message: "Artist deleted" });
    } catch (err) {
        console.error("Error deleting artist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createArtist,
    getArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
    addOpinion
};
