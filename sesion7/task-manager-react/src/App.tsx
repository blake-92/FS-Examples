import { useEffect, useState } from "react";
import type { Task, TaskStatus } from "./types";

import Header from "./components/Header";
import TaskInput from "./components/TaskInput";
import TaskBoard from "./components/TaskBoard";
import EmptyState from "./components/EmptyState";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));

  const [authView, setAuthView] = useState<"login" | "register">("login");

  const [tasks, setTasks] = useState<Task[]>([]);

  const saveToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) {
      logout();
      throw new Error("Sesión expirada");
    }
    return response;
  };

  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      const response = await authFetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks().catch(() => {});
  }, [token]);

  const addTask = async (text: string, dueDate?: string, description?: string) => {
    const response = await authFetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, dueDate: dueDate, description: description }),
    });
    const newTask: Task = await response.json();
    setTasks([...tasks, newTask]);
  };

  const deleteTask = async (id: number) => {
    await authFetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = async (id: number, text: string, dueDate?: string, description?: string) => {
    await authFetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, dueDate: dueDate ?? null, description: description ?? null }),
    });
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, text: text, dueDate: dueDate, description: description }
          : task
      )
    );
  };

  const moveTask = async (id: number, status: TaskStatus) => {
    await authFetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status }),
    });
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status: status } : task))
    );
  };

  const today = new Date().toISOString().slice(0, 10);
  const completed = tasks.filter((task) => task.status === "hecho").length;
  const pending = tasks.filter((task) => task.status !== "hecho").length;
  const overdue = tasks.filter(
    (task) => task.status !== "hecho" && task.dueDate !== undefined && task.dueDate < today
  ).length;

  if (!token) {
    if (authView === "register") {
      return <Register apiUrl={API_URL} onSwitchToLogin={() => setAuthView("login")} />;
    }
    return (
      <Login
        apiUrl={API_URL}
        onLogin={saveToken}
        onSwitchToRegister={() => setAuthView("register")}
      />
    );
  }

  return (
    <div className="app-container">
      <Header onLogout={logout} />
      <TaskInput onAddTask={addTask} />

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <TaskBoard
            tasks={tasks}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
            onMoveTask={moveTask}
          />
          <Footer
            total={tasks.length}
            completed={completed}
            pending={pending}
            overdue={overdue}
          />
        </>
      )}
    </div>
  );
}

export default App;
