const Task = require('../models/Task');

exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  console.log(req.user)
  try {
    const { page = 1, status, name, date } = req.query;
    const query = { user: req.user.id };
    if (status) query.status = status;
    if (name) query.name = { $regex: name, $options: 'i' };
    if (date) query.date = { $gte: new Date(date) };
    const tasks = await Task.find(query)
      .skip((page - 1) * 10)
      .limit(10);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};