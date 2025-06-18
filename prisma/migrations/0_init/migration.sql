-- CreateTable
CREATE TABLE "saved" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "modelData" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL,
    "submitted" TIMESTAMP(3),

    CONSTRAINT "saved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifyId" TEXT,
    "resetToken" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "submitted" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modelData" TEXT NOT NULL,
    "timeframe" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_resetToken_key" ON "user"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_password_key" ON "user"("email", "password");

-- AddForeignKey
ALTER TABLE "saved" ADD CONSTRAINT "saved_email_fkey" FOREIGN KEY ("email") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "user"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "saved"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

