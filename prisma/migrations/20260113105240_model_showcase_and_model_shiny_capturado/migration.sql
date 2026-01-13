-- CreateEnum
CREATE TYPE "MethodCaught" AS ENUM ('SAFARI', 'EGG', 'SINGLE', 'HORDE3', 'HORDE5', 'FISHING', 'MYSTERIOUS', 'OTHERS');

-- CreateEnum
CREATE TYPE "StillHas" AS ENUM ('YES', 'SELL', 'FLED');

-- CreateTable
CREATE TABLE "Showcase" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Showcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShinyCaptured" (
    "id" SERIAL NOT NULL,
    "pokemonName" TEXT NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "encounters" INTEGER NOT NULL DEFAULT 0,
    "isAlpha" BOOLEAN NOT NULL DEFAULT false,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "methodCaught" "MethodCaught" NOT NULL DEFAULT 'OTHERS',
    "captureDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stillHas" "StillHas" NOT NULL DEFAULT 'YES',
    "nature" TEXT NOT NULL DEFAULT 'Not informed.',
    "showcaseId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShinyCaptured_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Showcase_userId_key" ON "Showcase"("userId");

-- AddForeignKey
ALTER TABLE "Showcase" ADD CONSTRAINT "Showcase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShinyCaptured" ADD CONSTRAINT "ShinyCaptured_showcaseId_fkey" FOREIGN KEY ("showcaseId") REFERENCES "Showcase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
