import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const USERS = [
  {
    email: "admin@test.com",
    password: "123456",
    tasks: [
      { text: "Preparar la presentación final", status: "en-progreso" },
      { text: "Revisar el código del proyecto", status: "pendiente" },
    ],
  },
  {
    email: "ana@test.com",
    password: "123456",
    tasks: [
      { text: "Estudiar Prisma y bcrypt", status: "idea" },
      { text: "Practicar el login con JWT", status: "pendiente" },
    ],
  },
  {
    email: "luis@test.com",
    password: "123456",
    tasks: [
      { text: "Instalar PostgreSQL con Docker", status: "hecho" },
      { text: "Repasar cómo funciona CORS", status: "idea" },
    ],
  },
];

async function main() {
  for (const u of USERS) {
    const hash = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hash },
      create: { email: u.email, password: hash },
    });

    const count = await prisma.task.count({ where: { userId: user.id } });
    if (count === 0) {
      await prisma.task.createMany({
        data: u.tasks.map((t) => ({ ...t, userId: user.id })),
      });
    }

    console.log(`Usuario listo: ${user.email} (contraseña: ${u.password})`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
