-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "firstname" TEXT DEFAULT '',
    "lastname" TEXT DEFAULT '',
    "email" TEXT DEFAULT '',
    "phone_number" TEXT DEFAULT '',
    "password" TEXT DEFAULT '',
    "user_type" INTEGER,
    "balance" DECIMAL(10,2),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
