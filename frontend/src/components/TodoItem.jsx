import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion'; // ✅ 引入 motion

function TodoItem({ todo, toggleComplete, deleteTodo, editTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(todo.text);

  const handleEdit = () => setIsEditing(true);
  const handleChange = (e) => setNewText(e.target.value);
  const handleSave = () => {
    if (newText.trim() && newText !== todo.text) {
      editTodo(todo._id, newText);
    }
    setIsEditing(false);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  return (
    <motion.li
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -50 }}
      transition={{ duration: 0.3 }}
    >

      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleComplete(todo._id)}
      />

      {isEditing ? (
        <input
          type="text"
          value={newText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
        />
      ) : (
        <span
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            cursor: 'pointer'
          }}
          onClick={handleEdit}
        >
          {todo.text}
        </span>
      )}

      <button onClick={() => deleteTodo(todo._id)}>
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </motion.li>
  );
}

export default TodoItem;
