const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

// GET: Fetch all todos
router.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ completed: 1, createdAt: -1 }); // Sort by completion, then by creation date
  res.json(todos);
});

// POST: Create a new todo
router.post('/', async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    completed: false,
    createdAt: req.body.createdAt || new Date(),
  });

  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});

// PATCH: Update a todo
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (req.body && typeof req.body.text === 'string') {
      // If text is provided in the body, update the content
      todo.text = req.body.text;
    } else {
      // Otherwise, toggle the completion status
      todo.completed = !todo.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE: Remove a todo
router.delete('/:id', async (req, res) => {
  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
  res.json(deletedTodo);
});

module.exports = router;
