-- DropForeignKey
ALTER TABLE "ShinyCaptured" DROP CONSTRAINT "ShinyCaptured_showcaseId_fkey";

-- DropForeignKey
ALTER TABLE "Showcase" DROP CONSTRAINT "Showcase_userId_fkey";

-- DropIndex
DROP INDEX "Showcase_userId_key";

-- AddForeignKey
ALTER TABLE "Showcase" ADD CONSTRAINT "Showcase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShinyCaptured" ADD CONSTRAINT "ShinyCaptured_showcaseId_fkey" FOREIGN KEY ("showcaseId") REFERENCES "Showcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
