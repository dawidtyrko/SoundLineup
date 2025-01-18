const Group = require('../models/Group');
const Local = require('../models/Local');
const Artist = require('../models/Artist');
const res = require("express/lib/response");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {loginArtist} = require("./artistController");
require("dotenv").config();

// Create a new Group
const createGroup = async (req, res) => {
    const { name,  members, password } = req.body;
    try {

        const group = new Group({ name, members,password });
        const result = await group.save();

        // Add groupId to each member
        if (members && members.length > 0) {
            await Artist.updateMany(
                { _id: { $in: members } },
                { $set: { groupId: result._id } }
            );
        }

        res.status(201).json({ message: "Group created", group: result });
    } catch (err) {
        console.error("Error creating group:", err);
        res.status(400).json({ message: err.message });
    }
};

const addMemberToGroup = async (req, res) => {
    const { groupId, artistId } = req.body;

    try {
        // Find the group by ID
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Check if the artist is already a member of the group
        if (group.members.includes(artistId)) {
            return res.status(400).json({ message: "Artist is already a member of this group" });
        }

        // Add the artist to the group's members array
        group.members.push(artistId);
        await group.save();

        // Update the artist's groupId
        await Artist.findByIdAndUpdate(artistId, { groupId: group._id });

        res.status(200).json({ message: "Artist added to group", group });
    } catch (err) {
        console.error("Error adding member to group:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const changePassword = async (req, res) => {
    const {currentPassword, newPassword} = req.body;
    const groupId = req.params.id;

    try{
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, group.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        group.password = await bcrypt.hash(newPassword, 10);
        await group.save();
        res.status(200).json({ message: "Group updated", group: group });
    }catch(err) {
        console.error("Error changing password:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

const loginGroup = async (req, res) => {
    const {name, password} = req.body;

    try{
        const group = await Group.findOne({name})
        if(!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, group.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //create token
        const token = jwt.sign({id: group._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({ message: "Group successfully logged in", user: group, token: token });
    }catch(err){
        console.error("Error login artist:", err);
        res.status(500).json({ message: err.message });
    }
}

// Get all Groups
const getGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .populate('members', 'name age');
        res.status(200).json({ message: "Groups retrieved", groups: groups });
    } catch (err) {
        console.error("Error retrieving groups:", err);
        res.status(500).json({ message: err.message });
    }
};

// Get a single Group by ID
const getGroupById = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('members', 'name age');
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        res.status(200).json({message: "Groups retrieved", group: group});
    } catch (err) {
        console.error("Error retrieving group:", err);
        res.status(500).json({ message: err.message });
    }
};

// Update a Group by ID
const updateGroup = async (req, res) => {
    const { members } = req.body;
    try {

        const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // If members are updated, ensure their groupId is set correctly
        if (members) {
            // Remove groupId from previous members not in the new members list
            await Artist.updateMany(
                { groupId: group._id, _id: { $nin: members } },
                { $set: { groupId: null } }
            );

            // Set groupId for new members
            await Artist.updateMany(
                { _id: { $in: members }, groupId: { $ne: group._id } },
                { $set: { groupId: group._id } }
            );
        }

        res.status(200).json({ message: "Group updated", group });
    } catch (err) {
        console.error("Error updating group:", err);
        res.status(400).json({ message: err.message });
    }
};

// Delete a Group by ID
const deleteGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        await deleteProfileImage(group);
        // Remove groupId from all members
        if (group.members && group.members.length > 0) {
            await Artist.updateMany(
                { _id: { $in: group.members } },
                { $set: { groupId: null } }
            );
        }

        res.status(200).json({ message: "Group deleted" });
    } catch (err) {
        console.error("Error deleting group:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const addRating = async (req, res) => {
    try {
        const { rating, localId } = req.body;  // Extract rating and localId from request body
        const groupId = req.params.id; // Artist ID from the route parameter

        // Validate required fields
        if (!rating || !localId) {
            return res.status(400).json({ message: "Rating and localId are required" });
        }

        // Ensure the rating is within the valid range
        if (rating < 1 || rating > 10) {
            return res.status(400).json({ message: "Rating must be between 1 and 10" });
        }


        const group = await Group.findById(groupId);
        if (!group) {
            console.error('Group not found');
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if a rating from the same localId already exists
        const existingRating = group.ratings.find(rating => rating.localId === localId);
        if (existingRating) {
            console.error('Rating from this local already exists');
            return res.status(400).json({ message: 'Rating from this local already exists' });
        }

        // Add the new rating to the artist's ratings array
        group.ratings.push({ rating, localId });

        // Save the updated artist data
        const updatedGroup = await group.save();

        console.log('Updated Group:', updatedGroup);
        return res.status(201).json({ message: 'Rating added successfully', group: updatedGroup });
    } catch (err) {
        console.error('Error adding rating:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const addGroupOpinion = async (groupId, opinion, localName, localId) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.error('Group not found');
            return { message: "Group not found", status: 404 };
        }

        const existingOpinion = group.opinions.find(op => op.localId === localId);
        if (existingOpinion) {
            console.error('Opinion from this local already exists');
            return { message: 'Opinion from this local already exists', status: 400 };
        }

        group.opinions.push({ opinion, localName, localId });
        const updatedGroup = await group.save();

        console.log('Updated group:', updatedGroup);
        return { message: 'Opinion added successfully', status: 201, group: updatedGroup };

    } catch (err) {
        console.error('Error adding opinion to Group:', err);
        return { message: 'Internal server error', status: 500 };
    }
};

const uploadProfileImage = async (groupId, file) => {
    try {

        if (!file) {
            console.error('No file uploaded');
            return{message: "No file uploaded", status:400}
        }

        const filePath = `uploads/${file.filename}`; // Path where the image is stored

        // Update the artist's profile image
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { profileImage: filePath }, // Save file path in the artist document
            { new: true }
        );

        if (!updatedGroup) {
            console.error('Group not found');
            return { message: 'Group not found', status: 404 };
        }

        return { message: "Profile image uploaded successfully", group: updatedGroup, status: 200 };
    } catch (err) {
        console.error('Error uploading profile image:', err);
        return { message: err.message, status: 500 };
    }
};

const deleteProfileImage = async (req, res) => {
    const groupId = req.params.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Artist not found" });
        }

        // Check if the artist has a profile image
        if (group.profileImage) {
            const imagePath = path.join(__dirname, '../', group.profileImage);

            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                    return res.status(500).json({ message: "Error deleting image from server" });
                }

                // Clear the profileImage field in the artist document
                group.profileImage = undefined;
                group.save();

                return res.status(200).json({ message: "Profile image deleted successfully" });
            });
        } else {
            return res.status(404).json({ message: "No profile image to delete" });
        }
    } catch (err) {
        console.error('Error deleting image:', err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const addAudioLink = async (groupId, platform, url) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.error('Group not found');
            return { message: 'Group not found', status: 404 };
        }

        // Check if the link from the same platform already exists
        const existingLink = group.audioLinks.find(link => link.platform === platform);
        if (existingLink) {
            console.error(`Audio link from ${platform} already exists`);
            return { message: `Audio link from ${platform} already exists`, status: 400 };
        }

        // Add the new audio link
        group.audioLinks.push({ platform, url });
        const updatedGroup = await group.save();

        console.log('Updated Group:', updatedGroup);
        return { message: 'Audio link added successfully', status: 201, group: updatedGroup };
    } catch (err) {
        console.error('Error adding audio link:', err);
        return { message: 'Internal server error', status: 500 };
    }
};

const deleteAudioLink = async (groupId, platform) => {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.error('Group not found');
            return { message: 'group not found', status: 404 };
        }

        // Find the audio link from the specified platform
        const linkToRemove = group.audioLinks.find(link => link.platform === platform);
        if (!linkToRemove) {
            console.error(`Audio link from ${platform} not found`);
            return { message: `Audio link from ${platform} not found`, status: 404 };
        }

        // Remove the audio link
        group.audioLinks = group.audioLinks.filter(link => link.platform !== platform);
        const updatedGroup = await group.save();

        console.log('Updated Artist:', updatedGroup);
        return { message: `Audio link from ${platform} removed successfully`, status: 200, group: updatedGroup };
    } catch (err) {
        console.error('Error deleting audio link:', err);
        return { message: 'Internal server error', status: 500 };
    }
};


module.exports = {
    createGroup,
    getGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    addGroupOpinion,
    uploadProfileImage,
    loginGroup,
    addRating,
    addAudioLink,
    deleteAudioLink,
    addMemberToGroup
};
