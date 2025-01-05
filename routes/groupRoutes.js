// /routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createGroup, getGroups, getGroupById, updateGroup, deleteGroup,addGroupOpinion } = require('../controllers/groupController');
const { groupValidator } = require('../middleware/groupValidator'); // Assuming you have a validator


// Create a Group
router.post('/', groupValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await createGroup(req, res);
});
// router.post('/:id/opinion', async (req, res) => {
//     const { opinion, localName, localId } = req.body;  // Extract opinion and localName from request body
//     const groupId = req.params.id;  // Get Group ID from route params
//
//     if (!opinion || !localName || !localId) {
//         return res.status(400).json({ message: "Opinion and localName are required" });
//     }
//
//     try {
//         await addGroupOpinion(groupId, opinion, localName,localId); // Call the function to add opinion
//         res.status(200).json({ message: "Opinion added successfully" });
//     } catch (err) {
//         console.error('Error adding opinion to group:', err);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });
router.post('/:id/opinion', async (req, res) => {
    const { opinion, localName, localId } = req.body;
    const groupId = req.params.id;

    if (!opinion || !localName || !localId) {
        return res.status(400).json({ message: "Opinion, localName, and localId are required" });
    }

    try {
        const result = await addGroupOpinion(groupId, opinion, localName, localId);
        res.status(result.status).json({ message: result.message, group: result.group });
    } catch (err) {
        console.error('Error adding opinion to group:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});
// Get all Groups
router.get('/', getGroups);

// Get a single Group by ID
router.get('/:id', getGroupById);

// Update a Group by ID
router.put('/:id', groupValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await updateGroup(req, res);
});

// Delete a Group by ID
router.delete('/:id', deleteGroup);


module.exports = router;
