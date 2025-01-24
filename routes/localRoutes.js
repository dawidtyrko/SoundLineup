// /routes/localRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createLocal, getLocals, getLocalById, updateLocal, deleteLocal,addLocalOpinion,loginLocal, changePassword} = require('../controllers/localController');
const { localValidator } = require('../middleware/localValidator'); // Assuming you have a validator
const {passwordValidation} = require("../middleware/passwordValidator");
const validateRequest = require('../middleware/validateRequest');
const authenticateToken = require('../middleware/authenticateToken');

router.post('/login',loginLocal)
// Create a Local
router.post('/', localValidator,passwordValidation,validateRequest, async (req, res) => {

    await createLocal(req, res);
});

router.post('/:id/opinion', async (req, res) => {
    const { opinion, artistName, artistId } = req.body;  // Extract opinion and artistName from request body
    const localId = req.params.id;  // Get Local ID from route params

    if (!opinion || !artistName || !artistId) {
        return res.status(400).json({ message: "Opinion, artistId and artistName are required" });
    }

    try {
        const result = await addLocalOpinion(localId, opinion, artistName,artistId); // Call the function to add opinion
        res.status(result.status).json({ message: result.message, local: result.local });
    } catch (err) {
        console.error('Error adding opinion to local:', err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all Locals
router.get('/', getLocals);

// Get a single Local by ID
router.get('/:id', getLocalById);

// Update a Local by ID
router.put('/:id', localValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    await updateLocal(req, res);
});
router.put('/:id',authenticateToken,passwordValidation,changePassword)

// Delete a Local by ID
router.delete('/:id', deleteLocal);

module.exports = router;
