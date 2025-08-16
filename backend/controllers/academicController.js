const AcademicEvent = require('../models/AcademicEvent');

// GET /api/academic  (user’s events)
const getEvents = async (req, res) => {
  try {
    const { from, to, limit = 200, skip = 0 } = req.query;

    const query = {};
    // Overlap with range: (start < to) AND (end > from)
    if (from || to) {
      query.$and = [];
      if (to)   query.$and.push({ start: { $lt: new Date(to) } });
      if (from) query.$and.push({ end:   { $gt: new Date(from) } });
      if (query.$and.length === 0) delete query.$and;
    }

    const docs = await AcademicEvent
      .find(query)
      .sort({ start: 1 })
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 500));

    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// POST /api/academic
const createEvent = async (req, res) => {
   try {
    const { title, start, end, allDay } = req.body;
    if (!title || !start || !end) {
      return res.status(400).json({ message: 'title, start, end are required' });
    }

    const ev = await AcademicEvent.create({
      title,
      start: new Date(start),
      end: new Date(end),
      allDay: !!allDay,
      isGlobal: true,            // 👈 ensure global visibility
      user: req.user?.id || null // remember the creator
    });

    res.status(201).json(ev);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// PUT /api/academic/:id
const updateEvent = async (req, res) => {
  try {
    const event = await AcademicEvent.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) return res.status(404).json({ message: 'Event not found or not owned by you' });

    const { title, start, end, allDay } = req.body;
    if (title !== undefined) event.title = title;
    if (start !== undefined) event.start = new Date(start);
    if (end !== undefined)   event.end   = new Date(end);
    if (allDay !== undefined) event.allDay = !!allDay;

    const saved = await event.save();
    res.json(saved);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// DELETE /api/academic/:id
const deleteEvent = async (req, res) => {
  try {
    const deleted = await AcademicEvent.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Event not found or not owned by you' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
