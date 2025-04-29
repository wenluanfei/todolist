import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './TodoForm';
import { motion } from 'framer-motion'; 
import TodoList from './TodoList';
import '../styles/TodoApp.css';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedCount, setCompletedCount] = useState(0); // 总完成任务数
  const [comboCount, setComboCount] = useState(0); // 连击计数
  const [showReward, setShowReward] = useState(false);
  const [showMegaReward, setShowMegaReward] = useState(false);
  const [showUltraReward, setShowUltraReward] = useState(false); // ✨ 五连击超级奖励
  


  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos');
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
      const res = await axios.post('http://localhost:5000/api/todos', { text });
      setTodos([res.data, ...todos]);
    } catch (error) {
      console.error('Failed to add todo:', error);
      setError('添加任务失败，请检查网络...');
    }
  };

  const toggleComplete = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.map(todo => (todo._id === id ? res.data : todo)));
  
      const toggledTodo = todos.find(todo => todo._id === id);
      if (!toggledTodo?.completed) {
        setCompletedCount(prev => prev + 1);
        const newComboCount = comboCount + 1;
        setComboCount(newComboCount);
  
        if (newComboCount === 5) {
          setShowUltraReward(true); // 🎆五连击爆炸
          setTimeout(() => setShowUltraReward(false), 4000);
          setComboCount(0); // 清零连击
        } else if (newComboCount === 3) {
          setShowMegaReward(true); // 🏆三连击奖励
          setTimeout(() => setShowMegaReward(false), 3000);
        } else {
          // 不是三连击也不是五连击，正常小奖励
          setShowReward(true); // 🎉小奖励
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
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setError('删除任务失败...');
    }
  };

  const editTodo = async (id, newText) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/todos/${id}`, { text: newText });
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
  
      {/* ✨新增完成任务计数器 */}
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
          initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
          animate={{ opacity: 1, scale: 1.5, rotate: 360 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          🎉 完成任务！棒极了！
        </motion.div>
      )}
  
      {showMegaReward && (
        <motion.div
          className="mega-reward"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 3, rotate: 720 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          🏆 超级连击奖励！
        </motion.div>
      )}

      {showUltraReward && (
        <motion.div
          className="mega-reward"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 3, rotate: 720 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          🏆 超级五连击奖励！🏆
        </motion.div>
      )}
  
  </motion.div>
  );
  
}

export default TodoApp;
