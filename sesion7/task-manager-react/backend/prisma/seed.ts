import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMAIL = "admin@test.com";
const PASSWORD = "123456";

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10);
  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: { password: hash },
    create: { email: EMAIL, password: hash },
  });
  console.log(`Usuario de demo listo: ${user.email} (contraseña: ${PASSWORD})`);

  const count = await prisma.task.count();
  if (count === 0) {
    await prisma.task.createMany({
      data: [
        { text: "Preparar la presentación final", status: "en-progreso" },
        { text: "Repasar cómo funciona JWT", status: "pendiente" },
        { text: "Instalar PostgreSQL con Docker", status: "hecho" },
        { text: "Estudiar Prisma y bcrypt", status: "idea" },
      ],
    });
    console.log("Tareas de ejemplo creadas.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
