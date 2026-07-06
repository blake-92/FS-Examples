import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = 3000;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en el .env");
}

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is working!");
});

app.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hash } });
    res.status(201).json({ id: user.id, email: user.email });
  } catch {
    res.status(409).json({ message: "El email ya está registrado" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ message: "Login successful", token: token });
});

app.get("/profile", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Protected profile data", user: decoded });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/tasks", requireAuth, async (req: Request, res: Response) => {
  const tasksFromDatabase = await prisma.task.findMany();
  res.json(tasksFromDatabase);
});

app.post("/tasks", requireAuth, async (req: Request, res: Response) => {
  const { text, dueDate, description } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Task text is required" });
  }

  const newTask = await prisma.task.create({
    data: {
      text: text.trim(),
      dueDate: dueDate,
      description: description,
    },
  });

  res.status(201).json(newTask);
});

app.put("/tasks/:id", requireAuth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { text, status, dueDate, description, completed } = req.body;

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: { text, status, dueDate, description, completed },
    });
    res.json(updated);
  } catch {
    res.status(404).json({ message: "Task not found" });
  }
});

app.delete("/tasks/:id", requireAuth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch {
    res.status(404).json({ message: "Task not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
