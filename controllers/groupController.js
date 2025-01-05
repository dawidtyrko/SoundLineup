const Group = require('../models/Group');
const Local = require('../models/Local');
const Artist = require('../models/Artist');
const res = require("express/lib/response");
const path = require("path");
const fs = require("fs");

// Create a new Group
const createGroup = async (req, res) => {
    const { name,  members } = req.body;
    try {

        const group = new Group({ name, members });
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

// Get all Groups
const getGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .populate('members', 'name age');
        res.status(200).json({ message: "Groups retrieved", groups });
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
        res.status(200).json(group);
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
    uploadProfileImage
};
