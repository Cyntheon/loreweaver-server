-- CreateEnum
CREATE TYPE "UserAuthType" AS ENUM ('Email', 'Google');

-- CreateEnum
CREATE TYPE "ContentUserPermissionsLevel" AS ENUM ('Blocked', 'Allowed', 'Admin');

-- CreateTable
CREATE TABLE "AuditLogEntry" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,

    CONSTRAINT "AuditLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" CITEXT NOT NULL,
    "displayName" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuth" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "UserAuthType" NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "location" TEXT,
    "website" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollowship" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followerId" UUID NOT NULL,
    "followeeId" UUID NOT NULL,
    "isRequest" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserFollowship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Realm" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" CITEXT NOT NULL,
    "ownerId" UUID NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "representationLoreId" UUID,

    CONSTRAINT "Realm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealmUserPermissions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "realmId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "permissionsLevel" "ContentUserPermissionsLevel" NOT NULL DEFAULT 'Allowed',

    CONSTRAINT "RealmUserPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lore" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" CITEXT NOT NULL,
    "realmId" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "thumbnailUrl" TEXT,
    "vignette" TEXT,

    CONSTRAINT "Lore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoreUserPermissions" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "loreId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "permissionsLevel" "ContentUserPermissionsLevel" NOT NULL DEFAULT 'Allowed',

    CONSTRAINT "LoreUserPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_userId_type_key" ON "UserAuth"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollowship_followerId_followeeId_key" ON "UserFollowship"("followerId", "followeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_representationLoreId_key" ON "Realm"("representationLoreId");

-- CreateIndex
CREATE INDEX "Realm_ownerId_idx" ON "Realm"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Realm_name_ownerId_key" ON "Realm"("name", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "RealmUserPermissions_realmId_userId_key" ON "RealmUserPermissions"("realmId", "userId");

-- CreateIndex
CREATE INDEX "Lore_realmId_idx" ON "Lore"("realmId");

-- CreateIndex
CREATE INDEX "Lore_ownerId_idx" ON "Lore"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Lore_name_realmId_key" ON "Lore"("name", "realmId");

-- CreateIndex
CREATE UNIQUE INDEX "LoreUserPermissions_loreId_userId_key" ON "LoreUserPermissions"("loreId", "userId");

-- AddForeignKey
ALTER TABLE "UserAuth" ADD CONSTRAINT "UserAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowship" ADD CONSTRAINT "UserFollowship_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollowship" ADD CONSTRAINT "UserFollowship_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Realm" ADD CONSTRAINT "Realm_representationLoreId_fkey" FOREIGN KEY ("representationLoreId") REFERENCES "Lore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealmUserPermissions" ADD CONSTRAINT "RealmUserPermissions_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealmUserPermissions" ADD CONSTRAINT "RealmUserPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_realmId_fkey" FOREIGN KEY ("realmId") REFERENCES "Realm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lore" ADD CONSTRAINT "Lore_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreUserPermissions" ADD CONSTRAINT "LoreUserPermissions_loreId_fkey" FOREIGN KEY ("loreId") REFERENCES "Lore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoreUserPermissions" ADD CONSTRAINT "LoreUserPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
