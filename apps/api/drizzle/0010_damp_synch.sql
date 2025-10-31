-- Adicionar coluna bank como nullable primeiro
ALTER TABLE "redacao" ADD COLUMN "bank" text;
-- Atualizar registros existentes com valor padrão
UPDATE "redacao" SET "bank" = 'ENEM' WHERE "bank" IS NULL;
-- Tornar a coluna NOT NULL
ALTER TABLE "redacao" ALTER COLUMN "bank" SET NOT NULL;