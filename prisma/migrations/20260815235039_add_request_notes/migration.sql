-- CreateTable
CREATE TABLE "RequestNote" (
    "id" TEXT NOT NULL,
    "requestType" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequestNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestNote_requestType_requestId_createdAt_idx" ON "RequestNote"("requestType", "requestId", "createdAt");
