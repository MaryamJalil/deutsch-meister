-- CreateTable
CREATE TABLE "Audio" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lessonId" INTEGER,

    CONSTRAINT "Audio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Audio_s3Key_key" ON "Audio"("s3Key");

-- AddForeignKey
ALTER TABLE "Audio" ADD CONSTRAINT "Audio_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
