import express, { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;

// La conexión a PostgreSQL a través de Prisma (usa DATABASE_URL del .env)
const prisma = new PrismaClient();

app.use(express.json());

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// Este array sigue aquí porque POST, PUT y DELETE aún no están conectados a Prisma.
const tasks: Task[] = [
  { id: 1, text: "Estudiar Node.js", completed: false },
  { id: 2, text: "Crear servidor Express", completed: true },
  { id: 3, text: "Probar rutas del backend", completed: false },
];

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is working!");
});

// GET /tasks ahora lee desde PostgreSQL (ya no usa el array)
app.get("/tasks", async (req: Request, res: Response) => {
  const tasksFromDatabase = await prisma.task.findMany();
  res.json(tasksFromDatabase);
});

app.post("/tasks", (req: Request, res: Response) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Task text is required" });
  }

  const newTask: Task = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { text, completed } = req.body;

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (text !== undefined) {
    task.text = text;
  }
  if (completed !== undefined) {
    task.completed = completed;
  }

  res.json(task);
});

app.delete("/tasks/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const [deleted] = tasks.splice(index, 1);
  res.json({ message: "Task deleted successfully", task: deleted });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
