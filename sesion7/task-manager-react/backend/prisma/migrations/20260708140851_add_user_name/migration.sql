-- Agrega la columna obligatoria `name` a User. Como la tabla ya tiene filas, se usa un
-- DEFAULT temporal para poblarlas y luego se quita (el schema no tiene @default; el nombre
-- real de cada usuario lo pone el seed / el registro).
ALTER TABLE "User" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Usuario';
ALTER TABLE "User" ALTER COLUMN "name" DROP DEFAULT;
