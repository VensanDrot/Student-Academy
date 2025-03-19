/*
  Warnings:

  - You are about to alter the column `cost` on the `Courses` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `balance` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Courses" ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "cost" SET DEFAULT 0,
ALTER COLUMN "cost" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" INTEGER,
    "user_id" INTEGER,
    "amount_paid" DOUBLE PRECISION,
    "course_price" DOUBLE PRECISION,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethods" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "card_number" TEXT DEFAULT '',
    "cvv" TEXT DEFAULT '',
    "holder_name" TEXT DEFAULT '',
    "phone_number" TEXT DEFAULT '',
    "type" TEXT DEFAULT '',
    "user_id" INTEGER,
    "exparation" TEXT DEFAULT '',

    CONSTRAINT "PaymentMethods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programs" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "course_id" INTEGER,
    "type" SMALLINT,
    "order" INTEGER,
    "time" TEXT DEFAULT '',
    "name" TEXT DEFAULT '',
    "description" TEXT DEFAULT '',
    "reward_score" DOUBLE PRECISION,
    "passing_score" DOUBLE PRECISION,

    CONSTRAINT "Programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramsFiles" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "program_id" INTEGER,
    "file_type" TEXT DEFAULT '',
    "file_name" TEXT DEFAULT '',
    "file_path" TEXT DEFAULT '',

    CONSTRAINT "ProgramsFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "question_id" INTEGER,
    "answer" TEXT DEFAULT '',
    "is_true" BOOLEAN,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "program_id" INTEGER,
    "question" TEXT DEFAULT '',

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResults" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "user_id" INTEGER,
    "test_id" INTEGER,
    "result" INTEGER,

    CONSTRAINT "TestResults_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PaymentMethods" ADD CONSTRAINT "PaymentMethods_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Programs" ADD CONSTRAINT "Programs_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Courses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ProgramsFiles" ADD CONSTRAINT "ProgramsFiles_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "Programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestResults" ADD CONSTRAINT "TestResults_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "Programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TestResults" ADD CONSTRAINT "TestResults_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
