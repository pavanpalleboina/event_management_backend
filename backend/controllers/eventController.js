const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  const { name, organizer, date, location, description, capacity, category } = req.body;

  console.log("Creating event:", { name, organizer, date, location, description, capacity, category });

  if (!name || !organizer || !location || !capacity || !date) {
    return res.status(400).json({ error: 'Event name, organizer, location, capacity, and date are required' });
  }

  const eventDate = new Date(date);
  const now = new Date();

  if (eventDate < now) {
    return res.status(400).json({ error: 'Event date must be in the future' });
  }

  if (capacity < 1) {
    return res.status(400).json({ error: 'Capacity must be at least 1' });
  }

  try {
    const event = new Event({ 
      name, 
      organizer, 
      location, 
      dateTime: eventDate,
      description: description || '', 
      capacity: parseInt(capacity), 
      category: category || 'general',
      seatsTaken: 0
    });

    console.log("Saving event:", event);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ error: err.message });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.editEvent = async (req, res) => {
   const {eventId} = req.query
  const { name, date,location,description } = req.body;

   

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    event.name = name;
    event.date = date;
    event.location = location;
    event.description = description;
    await event.save();
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.searchEvents = async (req, res) => {
  const { name, date } = req.query;
  let filter = {};

  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  if (date) {
    filter.date = date;
  }

  try {
    const events = await Event.find(filter);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
