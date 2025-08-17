const AcademicEvent = require('../models/AcademicEvent');

// Overlap helper: event overlaps [from,to] if start < to && end > from
const overlapFilter = (from, to) => {
  if (!from && !to) return {};
  const f = from ? new Date(from) : null;
  const t = to   ? new Date(to)   : null;

  if (f && t)   return { start: { $lt: t }, end: { $gt: f } };
  if (f && !t)  return { end:   { $gt: f } };
  if (!f && t)  return { start: { $lt: t } };
  return {};
};

exports.getEvents = async (req, res) => {
  try {
    const { from, to, limit = 500, skip = 0 } = req.query;

    const vis = { $or: [{ isGlobal: true }, { user: req.user._id }] };
    const range = overlapFilter(from, to);

    const events = await AcademicEvent
      .find({ ...vis, ...range })
      .sort({ start: 1 })
      .limit(Number(limit))
      .skip(Number(skip));

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, start, end, allDay = false, isGlobal = true } = req.body;
    if (!title || !start || !end) {
      return res.status(400).json({ message: 'title, start, end are required' });
    }
    const doc = await AcademicEvent.create({
      title,
      start: new Date(start),
      end:   new Date(end),
      allDay: !!allDay,
      isGlobal: !!isGlobal,
      user: req.user._id,
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.start) body.start = new Date(body.start);
    if (body.end)   body.end   = new Date(body.end);

    // Only allow updating your own or global (if you want that rule)
    const updated = await AcademicEvent.findOneAndUpdate(
      { _id: req.params.id, $or: [{ user: req.user._id }, { isGlobal: true }] },
      body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await AcademicEvent.findOneAndDelete({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { isGlobal: true }],
    });
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
