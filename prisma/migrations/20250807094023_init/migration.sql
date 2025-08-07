-- CreateEnum
CREATE TYPE "public"."ContactTool" AS ENUM ('LINE', 'EMAIL', 'MESSENGER', 'DM', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."LeadType" AS ENUM ('SUPPLIER', 'PROSPECT', 'FRIEND', 'PARTNER', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."MeetContext" AS ENUM ('MEAL', 'DRINKS', 'LUNCH', 'MEETING', 'ONLINE', 'EVENT', 'OTHER');

-- CreateTable
CREATE TABLE "public"."Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mainContactTool" "public"."ContactTool",
    "facebookUrl" TEXT,
    "firstMetAt" TIMESTAMP(3),
    "firstMetHow" TEXT,
    "leadType" "public"."LeadType",
    "memo" TEXT,
    "nextApptAt" TIMESTAMP(3),
    "nextApptNote" TEXT,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Interaction" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "place" TEXT,
    "context" "public"."MeetContext",
    "talkedAbout" TEXT,
    "nextAction" TEXT,
    "nextApptAt" TIMESTAMP(3),
    "nextApptNote" TEXT,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Interaction" ADD CONSTRAINT "Interaction_personId_fkey" FOREIGN KEY ("personId") REFERENCES "public"."Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
