/**
 * In-memory task store
 * Note: Data resets when server restarts. Use a database for persistence.
 */
const tasks = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: false },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: false },
  { id: 5, title: "Task 5", completed: false }
];

module.exports = tasks;