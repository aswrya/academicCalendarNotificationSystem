// backend/controllers/taskController.js
const Task = require('../models/Task');


const createTask = async (req, res) => {
  try {
    const data = { userId: req.user.id, ...req.body };
    const created = await Task.create(data);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const updateTask = async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };

