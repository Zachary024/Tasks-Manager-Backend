const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - MUST come before routes that need it
app.use(express.json());

// Import tasks data
// If your tasks.js is in the same folder as server.js, use './tasks.js'
// If it's in a /data folder, use './data/tasks.js'
const tasks = require('./data/tasks.js');

// Helper: Generate next unique ID (avoids duplicates after deletion)
const getNextId = () => {
  return tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
};

// Routes

// Health check
app.get('/', (req, res) => {
  res.send('Task Manager server is running successfully!');
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Get single task by ID - ADDED (was missing)
app.get('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);

  if (isNaN(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(task);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Validation: title is required
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required and must be a non-empty string' });
  }

  const newTask = {
    id: getNextId(),
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task (toggle or set fields)
app.patch('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);

  if (isNaN(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Allow partial updates from body if provided, otherwise toggle
  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Title must be a non-empty string' });
    }
    task.title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Completed must be a boolean' });
    }
    task.completed = completed;
  } else if (title === undefined) {
    // No fields provided, toggle as default behavior
    task.completed = !task.completed;
  }

  res.status(200).json(task);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);

  if (isNaN(taskId)) {
    return res.status(400).json({ message: 'Invalid task ID' });
  }

  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const [deletedTask] = tasks.splice(taskIndex, 1);

  res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
