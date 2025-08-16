const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/academicController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);                // all routes below require auth
router.get('/', getEvents);         // GET /api/academic
router.post('/', createEvent);      // POST /api/academic
router.put('/:id', updateEvent);    // PUT /api/academic/:id
router.delete('/:id', deleteEvent); // DELETE /api/academic/:id

module.exports = router;
