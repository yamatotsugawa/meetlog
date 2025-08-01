-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "mainContactTool" TEXT,
    "facebookUrl" TEXT,
    "firstMetAt" DATETIME,
    "firstMetHow" TEXT,
    "leadType" TEXT,
    "appearance" TEXT,
    "personality" TEXT,
    "impression" TEXT,
    "followupPlan" TEXT,
    "nextApptAt" DATETIME,
    "nextApptNote" TEXT,
    "tags" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "personId" TEXT NOT NULL,
    "occurredAt" DATETIME NOT NULL,
    "place" TEXT,
    "context" TEXT,
    "talkedAbout" TEXT,
    "nextAction" TEXT,
    "nextApptAt" DATETIME,
    "nextApptNote" TEXT,
    "memo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Interaction_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
