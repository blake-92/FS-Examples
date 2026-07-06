-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'idea';
