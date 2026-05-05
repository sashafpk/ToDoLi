import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [newTaskId, setNewTaskId] = useState(null);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const todayDate = formatDate(new Date());

  function addTask() {
    if (taskName.trim() === "" || deadline === null) return;

    const newTask = {
      id: Date.now(),
      name: taskName,
      deadline: formatDate(deadline),
      done: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskId(newTask.id);
    setTaskName("");
    setDeadline(null);

    setTimeout(() => {
      setNewTaskId(null);
    }, 400);
  }

  function toggleDone(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  const todayTasks = tasks.filter(
    (task) => task.deadline === todayDate && !task.done
  );

  const ongoingTasks = tasks.filter(
    (task) => task.deadline !== todayDate && !task.done
  );

  const doneTasks = tasks.filter((task) => task.done);

  function getStatus(task) {
    const today = new Date().toISOString().split("T")[0];

    if (task.deadline < today && !task.done) return "late";
    if (task.deadline === today && !task.done) return "today";
    return "";
  }

  function TaskCard({ task }) {
    const status = getStatus(task);

    return (
      <div
        className={`task-card ${status} ${
          task.id === newTaskId ? "new-task" : ""
        }`}
      >
        <label>
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleDone(task.id)}
          />
          <span>{task.name}</span>
        </label>

        <small>deadline: {task.deadline}</small>
      </div>
    );
  }

  return (
    <main className="page">
      <header className="header">
        <div className="check-icon">✓</div>

        <h1>
          <span className="title-word title-to">to</span>
          <span className="title-word title-do">do</span>
          <br />
          <span className="title-word title-list">list!</span>
        </h1>
      </header>

      <div className="add-form fade-in fade-delay-1">
        <input
          type="text"
          placeholder="write your task..."
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <div className="date-wrapper">
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
            placeholderText="pick deadline"
            dateFormat="yyyy-MM-dd"
            className="date-input"
            popperClassName="date-picker-popper"
          />
        </div>

        <button onClick={addTask}>+ add task</button>
      </div>

      <section className="board fade-in fade-delay-2">
        <div className="column">
          <h2>Today</h2>
          {todayTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        <div className="column">
          <h2>Ongoing</h2>
          {ongoingTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>

        <div className="column">
          <h2>Done</h2>
          {doneTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </section>

      <footer className="fade-in fade-delay-3">
        made with love – sasha &lt;3
      </footer>
    </main>
  );
}

export default App;