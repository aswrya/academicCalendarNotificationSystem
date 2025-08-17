// backend/routes/academicRoutes.js
const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/academicController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getEvents);
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;
