// /routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {addRating, createGroup, getGroups, getGroupById, updateGroup, deleteGroup,addGroupOpinion,loginGroup } = require('../controllers/groupController');
const { groupValidator } = require('../middleware/groupValidator'); // Assuming you have a validator
const authenticateToken  = require('../middleware/authenticateToken');
const {passwordValidation} = require("../middleware/passwordValidator");
const validateRequest = require('../middleware/validateRequest');


router.post('/login', loginGroup)
// Create a Group
router.post('/', groupValidator,passwordValidation,validateRequest, async (req, res) => {

    await createGroup(req, res);
});
router.post('/:id/rating',authenticateToken,addRating)

router.post('/:id/opinion', authenticateToken,async (req, res) => {
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
router.get('/:id',authenticateToken, getGroupById);

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
