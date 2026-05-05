import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

function App() {
  const API_URL = "http://168.110.195.228:3001";

  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [deadline, setDeadline] = useState(null);
  const [newTaskId, setNewTaskId] = useState(null);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const todayDate = formatDate(new Date());

  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        const formattedTasks = data.map((task) => ({
          ...task,
          done: Boolean(task.done),
          deadline: task.deadline?.split("T")[0] || task.deadline,
        }));

        setTasks(formattedTasks);
      })
      .catch((err) => console.log(err));
  }, []);

  function addTask() {
    if (taskName.trim() === "" || deadline === null) return;

    const newTask = {
      name: taskName,
      deadline: formatDate(deadline),
    };

    fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedTask = {
          ...data,
          done: Boolean(data.done),
          deadline: data.deadline?.split("T")[0] || data.deadline,
        };

        setTasks([formattedTask, ...tasks]);
        setNewTaskId(formattedTask.id);
        setTaskName("");
        setDeadline(null);

        setTimeout(() => {
          setNewTaskId(null);
        }, 400);
      })
      .catch((err) => console.log(err));
  }

  function toggleDone(id) {
    const selectedTask = tasks.find((task) => task.id === id);
    if (!selectedTask) return;

    const newDoneStatus = !selectedTask.done;

    fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: newDoneStatus }),
    })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, done: newDoneStatus } : task
          )
        );
      })
      .catch((err) => console.log(err));
  }

  const todayTasks = tasks.filter(
    (task) => task.deadline === todayDate && !task.done
  );

  const ongoingTasks = tasks.filter(
    (task) => task.deadline !== todayDate && !task.done
  );

  const doneTasks = tasks.filter((task) => task.done);

  function getStatus(task) {
    if (task.deadline < todayDate && !task.done) return "late";
    if (task.deadline === todayDate && !task.done) return "today";
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