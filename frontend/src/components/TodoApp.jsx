import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import '../styles/TodoApp.css';

const API_BASE_URL = 'https://todo-backend-os66.onrender.com'; // ✅ 改成你的线上后端地址

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
      setError('加载任务失败，请稍后再试...');
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
      setError('添加任务失败，请检查网络...');
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
          setComboCount(0);
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
      setError('切换完成状态失败...');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setError('删除任务失败...');
    }
  };

  const editTodo = async (id, newText) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/${id}`, { text: newText });
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
    } catch (error) {
      console.error('Failed to edit todo:', error);
      setError('保存修改失败...');
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

      {/* ✨ 完成任务计数器 */}
      <div className="counter">
        🎯 已完成任务数：{completedCount}
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
          🎉 完成任务！棒极了！
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
          🏆 三连击奖励！继续加油！
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
          🎆 五连击大爆炸！太厉害了！
        </motion.div>
      )}
    </motion.div>
  );
}

export default TodoApp;
