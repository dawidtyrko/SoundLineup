const Artist = require('../models/Artist');
const Group = require('../models/Group');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {Types} = require("mongoose");
const {validationResult} = require("express-validator");
require('dotenv').config();

const createArtist = async (req, res) => {
    const { name, age, password } = req.body;

    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const artist = new Artist({
            name,
            age,
            password,
        });

        const result = await artist.save();

        res.status(201).json({ message: "Artist created", artist: result });
    } catch (err) {
        console.error("Error creating artist:", err);
        res.status(400).json({ message: err.message });
    }
};


const changePassword = async (req, res) => {
    const {password, newPassword} = req.body;
    const artistId = req.params.id;

    try{
        if (!Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!password || !newPassword) {
            return res.status(400).json({ message: "Both currentPassword and newPassword are required" });
        }

        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }


        const isPasswordValid = await bcrypt.compare(password, artist.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        artist.password = newPassword;
        await artist.save();
        res.status(200).json({ message: "Artist updated", artist: artist });
    }catch(err) {
        console.error("Error changing password:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginArtist = async (req, res) => {
    const {name, password} = req.body;

    try{
        const artist = await Artist.findOne({name})
        if(!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, artist.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //create token
        const token = jwt.sign({id: artist._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ message: "Artist successfully logged in", user: artist, token: token });
    }catch(err){
        console.error("Error login artist:", err);
        res.status(500).json({ message: err.message });
    }
}

// Get all Artists
const getArtists = async (req, res) => {
    try {
        const artists = await Artist.find()
            .populate('groupId', 'name') // Populate group name
        res.status(200).json({ message: "Artists retrieved", artists: artists });
    } catch (err) {
        console.error("Error retrieving artists:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single Artist by ID
const getArtistById = async (req, res) => {
    try {
        const {id} = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const artist = await Artist.findById(id)
            .populate('groupId', 'name')
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }
        res.status(200).json({artist: artist});
    } catch (err) {
        console.error("Error retrieving artist:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update an Artist by ID
const updateArtist = async (req, res) => {
    const { groupName } = req.body;
    try {
        let groupId
        // If groupId is being updated, ensure the new group exists
        if (groupName) {
            const group = await Group.findOne({name:groupName});
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
            groupId = group._id

            const isMember = group.members.includes(req.params.id);
            if (!isMember) {
                return res.status(403).json({ message: "Artist is not a member of this group" })
            }
        }

        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        res.status(200).json({ message: "Artist updated", user:artist });
    } catch (err) {
        console.error("Error updating artist:", err);
        res.status(400).json({ message: err.message });
    }
};



const addOpinion = async (req,res) => {
    try {
        const { opinion, localName, localId } = req.body;  // Extract opinion and localName from request body
        const artistId = req.params.id;
        if (!opinion || !localName || !localId) {
            return res.status(400).json({ message: "Opinion, localId and localName are required" });
        }
        if (!Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
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

const addRating = async (req, res) => {
    try {
        const { rating, localId } = req.body;
        const artistId = req.params.id;


        if (!rating || !localId) {
            return res.status(400).json({ message: "Rating and localId are required" });
        }
        if (!Types.ObjectId.isValid(localId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }


        if (rating < 1 || rating > 10) {
            return res.status(400).json({ message: "Rating must be between 1 and 10" });
        }


        const artist = await Artist.findById(artistId);
        if (!artist) {
            console.error('Artist not found');
            return res.status(404).json({ message: 'Artist not found' });
        }

        // Check if a rating from the same localId already exists
        const existingRating = artist.ratings.find(rating => rating.localId === localId);
        if (existingRating) {
            console.error('Rating from this local already exists');
            return res.status(400).json({ message: 'Rating from this local already exists' });
        }

        // Add the new rating to the artist's ratings array
        artist.ratings.push({ rating, localId });

        // Save the updated artist data
        const updatedArtist = await artist.save();

        console.log('Updated Artist:', updatedArtist);
        return res.status(201).json({ message: 'Rating added successfully', artist: updatedArtist });
    } catch (err) {
        console.error('Error adding rating:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const deleteProfileImage = async (req, res) => {
    const artistId = req.params.id;

    try {
        if (!Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const artist = await Artist.findById(artistId);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        if (artist.profileImage) {
            const imagePath = path.join(__dirname, '../', artist.profileImage);

            // Delete the image file
            fs.unlink(imagePath, async (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                    return res.status(500).json({ message: "Error deleting image from server" });
                }

                // Clear the profileImage field in the artist document
                artist.profileImage = undefined;
                const updatedArtist = await artist.save();

                // Respond with updated artist data
                return res.status(200).json({
                    message: "Profile image deleted successfully",
                    user: updatedArtist,
                });
            });
        } else {
            return res.status(404).json({ message: "No profile image to delete" });
        }
    } catch (err) {
        console.error('Error deleting image:', err);
        res.status(500).json({ message: "Internal server error" });
    }
};



// Delete an Artist by ID
const deleteArtist = async (req, res) => {
    const artistId = req.params.id;
    try {
        if (!Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const artist = await Artist.findByIdAndDelete(artistId);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }

        await deleteProfileImage(req, res);


        if (artist.groupId) {
            await Group.findByIdAndUpdate(artist.groupId, { $pull: { members: artist._id } });
        }

        res.status(200).json({ message: "Artist deleted" });
    } catch (err) {
        console.error("Error deleting artist:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Add an Audio Link to the Artist's audioLinks
const addAudioLink = async (artistId, platform, url) => {
    try {
        if (!Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const artist = await Artist.findById(artistId);
        if (!artist) {
            console.error('Artist not found');
            return { message: 'Artist not found', status: 404 };
        }

        // Check if the link from the same platform already exists
        const existingLink = artist.audioLinks.find(link => link.platform === platform);
        if (existingLink) {
            console.error(`Audio link from ${platform} already exists`);
            return { message: `Audio link from ${platform} already exists`, status: 400 };
        }

        // Add the new audio link
        artist.audioLinks.push({ platform, url });
        const updatedArtist = await artist.save();

        console.log('Updated Artist:', updatedArtist);
        return { message: 'Audio link added successfully', status: 201, artist: updatedArtist };
    } catch (err) {
        console.error('Error adding audio link:', err);
        return { message: 'Internal server error', status: 500 };
    }
};

// Delete an Audio Link for the Artist from a specific platform
const deleteAudioLink = async (artistId, platform) => {
    try {
        const artist = await Artist.findById(artistId);
        if (!artist) {
            console.error('Artist not found');
            return { message: 'Artist not found', status: 404 };
        }

        // Find the audio link from the specified platform
        const linkToRemove = artist.audioLinks.find(link => link.platform === platform);
        if (!linkToRemove) {
            console.error(`Audio link from ${platform} not found`);
            return { message: `Audio link from ${platform} not found`, status: 404 };
        }

        // Remove the audio link
        artist.audioLinks = artist.audioLinks.filter(link => link.platform !== platform);
        const updatedArtist = await artist.save();

        return { message: `Audio link from ${platform} removed successfully`, status: 200, user: updatedArtist };
    } catch (err) {
        console.error('Error deleting audio link:', err);
        return { message: 'Internal server error', status: 500 };
    }
};

const uploadProfileImage = async (artistId, file) => {
    try {

        if (!file) {
            console.error('No file uploaded');
           return{message: "No file uploaded", status:400}
        }

        const filePath = `uploads/${file.filename}`; // Path where the image is stored

        // Update the artist's profile image
        const updatedArtist = await Artist.findByIdAndUpdate(
            artistId,
            { profileImage: filePath }, // Save file path in the artist document
            { new: true }
        );


        if (!updatedArtist) {
            console.error('Artist not found');
            return { message: 'Artist not found', status: 404 };
        }

        return { message: "Profile image uploaded successfully", user: updatedArtist, status: 200 };
    } catch (err) {
        console.error('Error uploading profile image:', err);
        return { message: err.message, status: 500 };
    }
};

module.exports = {
    createArtist,
    getArtists,
    getArtistById,
    updateArtist,
    deleteArtist,
    addOpinion,
    addAudioLink,
    deleteAudioLink,
    uploadProfileImage,
    deleteProfileImage,
    loginArtist,
    changePassword,
    addRating
};
