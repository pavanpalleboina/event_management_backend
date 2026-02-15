const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  deleteEvent,
  searchEvents,
  getEventById,
  editEvent
} = require('../controllers/eventController');

router.get('/', getEvents);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);
router.get('/search', searchEvents);
router.get('/:id', getEventById);
router.put('/edit',editEvent)

module.exports = router;