import React from 'react';
import TodoItem from './TodoItem';
import { AnimatePresence, motion } from 'framer-motion';

function TodoList({ todos, toggleComplete, deleteTodo, editTodo }) {
  if (todos.length === 0) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="empty-text">🌿 No tasks yet. Add one to get started!</p>
      </motion.div>
    );
  }

  return (
    <ul className="todo-list">
      <AnimatePresence>
        {todos
          .sort((a, b) => a.completed - b.completed)  // Show incomplete tasks first
          .map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
              editTodo={editTodo}
            />
          ))}
      </AnimatePresence>
    </ul>
  );
}

export default TodoList;
