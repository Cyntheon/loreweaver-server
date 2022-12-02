-- CreateTable
CREATE TABLE "_Collection_ContentList" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Collection_ContentList_AB_unique" ON "_Collection_ContentList"("A", "B");

-- CreateIndex
CREATE INDEX "_Collection_ContentList_B_index" ON "_Collection_ContentList"("B");

-- AddForeignKey
ALTER TABLE "_Collection_ContentList" ADD CONSTRAINT "_Collection_ContentList_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Collection_ContentList" ADD CONSTRAINT "_Collection_ContentList_B_fkey" FOREIGN KEY ("B") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
