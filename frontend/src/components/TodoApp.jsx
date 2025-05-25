import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import '../styles/TodoApp.css';

const API_BASE_URL = 'https://todo-backend-os66.onrender.com/api/todos';  // Online backend URL

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showMegaReward, setShowMegaReward] = useState(false);
  const [showUltraReward, setShowUltraReward] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_BASE_URL);
      setTodos(res.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      setError('Failed to load tasks. Please try again later...');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (text) => {
    try {
      const res = await axios.post(API_BASE_URL, { text });
      setTodos([res.data, ...todos]);
    } catch (error) {
      console.error('Failed to add todo:', error);
      setError('Failed to add task. Please check your network...');
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/${id}`);
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));

      const toggledTodo = todos.find(todo => todo._id === id);
      if (!toggledTodo?.completed) {
        setCompletedCount(prev => prev + 1);
        const newComboCount = comboCount + 1;
        setComboCount(newComboCount);

        if (newComboCount === 5) {
          setShowUltraReward(true);
          setTimeout(() => setShowUltraReward(false), 4000);
          setComboCount(0);  // Reset combo after ultra reward
        } else if (newComboCount === 3) {
          setShowMegaReward(true);
          setTimeout(() => setShowMegaReward(false), 3000);
        } else {
          setShowReward(true);
          setTimeout(() => setShowReward(false), 2000);
        }
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      setError('Failed to toggle completion status...');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setError('Failed to delete task...');
    }
  };

  const editTodo = async (id, newText) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/${id}`, { text: newText });
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (error) {
      console.error('Failed to edit todo:', error);
      setError('Failed to save changes...');
    }
  };

  return (
    <motion.div
      className="todo-app"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h1>My To-Do List</h1>

      {/* 🎯 Completed task counter */}
      <div className="counter">
        🎯 Completed Tasks: {completedCount}
      </div>

      <TodoForm addTodo={addTodo} />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <TodoList
          todos={todos}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      )}

      {showReward && (
        <motion.div
          className="reward-popup"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          🎉 Task Completed! Great Job!
        </motion.div>
      )}

      {showMegaReward && (
        <motion.div
          className="mega-reward"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          🏆 Triple Combo! Keep Going!
        </motion.div>
      )}

      {showUltraReward && (
        <motion.div
          className="ultra-reward"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          🎆 Five-Task Combo Explosion! Amazing!
        </motion.div>
      )}
    </motion.div>
  );
}

export default TodoApp;
