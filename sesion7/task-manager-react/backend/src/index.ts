import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Falta JWT_SECRET en el .env");
}

const prisma = new PrismaClient();

const FRONTEND_URL = process.env.FRONTEND_URL;
app.use(cors(FRONTEND_URL ? { origin: FRONTEND_URL, credentials: true } : {}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Backend is working!");
});

app.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hash } });
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
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

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({
    message: "Login successful",
    token: token,
    user: { id: user.id, name: user.name, email: user.email },
  });
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
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).userEmail = decoded.email;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

app.get("/tasks", requireAuth, async (req: Request, res: Response) => {
  const userEmail = (req as any).userEmail as string;
  const tasksFromDatabase = await prisma.task.findMany({
    where: { user: { email: userEmail } },
  });
  res.json(tasksFromDatabase);
});

app.post("/tasks", requireAuth, async (req: Request, res: Response) => {
  const userEmail = (req as any).userEmail as string;
  const { text, dueDate, description } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ message: "Task text is required" });
  }

  const newTask = await prisma.task.create({
    data: {
      text: text.trim(),
      dueDate: dueDate,
      description: description,
      user: { connect: { email: userEmail } },
    },
  });

  res.status(201).json(newTask);
});

app.put("/tasks/:id", requireAuth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userEmail = (req as any).userEmail as string;
  const { text, status, dueDate, description, completed } = req.body;

  const result = await prisma.task.updateMany({
    where: { id, user: { email: userEmail } },
    data: { text, status, dueDate, description, completed },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updated = await prisma.task.findUnique({ where: { id } });
  res.json(updated);
});

app.delete("/tasks/:id", requireAuth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const userEmail = (req as any).userEmail as string;

  const result = await prisma.task.deleteMany({
    where: { id, user: { email: userEmail } },
  });

  if (result.count === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
