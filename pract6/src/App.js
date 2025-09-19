import React, { useState } from "react";
import { FaTrash, FaSearch, FaEdit, FaSave } from "react-icons/fa";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTask = () => {
    if (input.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEdit = (id, currentText) => {
    setEditId(id);
    setEditText(currentText);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: editText } : task
      )
    );
    setEditId(null);
    setEditText("");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
    if (filter === "completed") return task.completed && matchesSearch;
    if (filter === "pending") return !task.completed && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="app">
      <div className="todo-container">
        <h1 className="main-heading">To-Do List</h1>

        <div className="label-row">
          <div>
            <label className="label">Search Tasks</label>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Filter By</label>
            <select
              className="filter-dropdown"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={input}
            placeholder="Add a new task..."
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask}>Add</button>
        </div>

        {tasks.length > 0 && (
          <div className="clear-btn-wrapper">
            <button className="clear-btn" onClick={() => setTasks([])}>Clear All</button>
          </div>
        )}

        <ul>
          {filteredTasks.length === 0 ? (
            <li style={{ justifyContent: "center", color: "#777" }}>No tasks found</li>
          ) : (
            filteredTasks.map((task) => (
              <li key={task.id} className={task.completed ? "completed" : ""}>
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                  />
                  {editId === task.id ? (
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    <span>{task.text}</span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {editId === task.id ? (
                    <button className="edit-btn" onClick={() => saveEdit(task.id)} title="Save">
                      <FaSave />
                    </button>
                  ) : (
                    <button className="edit-btn" onClick={() => startEdit(task.id, task.text)} title="Edit">
                      <FaEdit />
                    </button>
                  )}
                  <button className="delete-btn" onClick={() => deleteTask(task.id)} title="Delete">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
