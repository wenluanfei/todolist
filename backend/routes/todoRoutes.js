const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

// GET 获取所有 todos
router.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ completed: 1, createdAt: -1 }); // 排序条件
  res.json(todos);
});


// POST 新建 todo
router.post('/', async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    completed: false,
    createdAt: req.body.createdAt || new Date(),
  });

  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});


// PATCH 更新 todo
router.patch('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (req.body && typeof req.body.text === 'string') {
      // 如果 body 里面有 text，说明是编辑内容
      todo.text = req.body.text;
    } else {
      // 否则切换完成状态
      todo.completed = !todo.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE 删除 todo
router.delete('/:id', async (req, res) => {
  const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
  res.json(deletedTodo);
});

module.exports = router;
