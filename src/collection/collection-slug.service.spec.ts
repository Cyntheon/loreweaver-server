import {Test} from "@nestjs/testing";
import {PrismaService, PrismaUtilsService} from "../prisma";
import {SlugService} from "../slug";
import {CollectionSlugService} from "./collection-slug.service";

describe("CollectionSlugService", () => {
  let service: CollectionSlugService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CollectionSlugService,
        {
          provide: PrismaService,
          useValue: {
            collectionSlug: {
              findUnique: jest.fn().mockReturnValue({
                id: "1",
                baseSlug: "slug",
                discriminator: 1,
                authorId: "1"
              }),
              findMany: jest.fn().mockReturnValue([
                {id: "1", baseSlug: "slug", discriminator: 1, authorId: "1"},
                {id: "2", baseSlug: "slug", discriminator: 2, authorId: "1"},
                {id: "3", baseSlug: "test", discriminator: 1, authorId: "1"},
                {id: "4", baseSlug: "test", discriminator: 3, authorId: "1"}
              ]),
              create: jest.fn().mockReturnValue({
                id: "5",
                baseSlug: "test",
                discriminator: 2,
                authorId: "1"
              }),
              update: jest.fn().mockReturnValue({
                id: "1",
                baseSlug: "test",
                discriminator: 2,
                authorId: "1"
              }),
              delete: jest.fn().mockReturnValue({
                id: "1",
                baseSlug: "slug",
                discriminator: 1,
                authorId: "1"
              })
            }
          }
        },
        {
          provide: PrismaUtilsService,
          useValue: {
            injectIdIntoArgs: jest.fn(
              (args: {data: Record<string, unknown>}) => ({
                ...args,
                data: {...args.data, id: "5"}
              })
            )
          }
        },
        {
          provide: SlugService,
          useValue: {
            findLowestAvailableDiscriminator: jest.fn().mockReturnValue(2)
          }
        }
      ]
    }).compile();

    service = moduleRef.get<CollectionSlugService>(CollectionSlugService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getCollectionSlug", () => {
    it("should get a collection slug from prisma", async () => {
      const result = await service.getCollectionSlug({where: {id: "1"}});
      expect(result).toEqual({
        id: "1",
        baseSlug: "slug",
        discriminator: 1,
        authorId: "1"
      });
      expect(
        // eslint-disable-next-line
        (service as any).prisma.collectionSlug.findUnique
      ).toHaveBeenCalled();
    });
  });

  describe("getManyCollectionSlugs", () => {
    it("should get many collection slugs from prisma", async () => {
      const result = await service.getManyCollectionSlugs({});
      expect(result).toEqual([
        {id: "1", baseSlug: "slug", discriminator: 1, authorId: "1"},
        {id: "2", baseSlug: "slug", discriminator: 2, authorId: "1"},
        {id: "3", baseSlug: "test", discriminator: 1, authorId: "1"},
        {id: "4", baseSlug: "test", discriminator: 3, authorId: "1"}
      ]);
      expect(
        // eslint-disable-next-line
        (service as any).prisma.collectionSlug.findMany
      ).toHaveBeenCalled();
    });
  });

  describe("createCollectionSlug", () => {
    beforeEach(() => {
      jest
        .spyOn(service, "getManyCollectionSlugs")
        // eslint-disable-next-line @typescript-eslint/require-await
        .mockImplementation(async () => [
          {id: "3", baseSlug: "test", discriminator: 1, authorId: "1"},
          {id: "4", baseSlug: "test", discriminator: 3, authorId: "1"}
        ]);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should error if args.data.author.connect is not defined", async () => {
      await expect(
        service.createCollectionSlug({
          data: {
            baseSlug: "test",
            author: {
              create: {
                id: "1",
                username: "test",
                followTarget: {connect: {id: "1"}}
              }
            }
          }
        })
      ).rejects.toThrowError();
    });

    it("should create a collection slug with an id and discriminator", async () => {
      const collectionSlug = await service.createCollectionSlug({
        data: {baseSlug: "test", author: {connect: {id: "1"}}}
      });
      expect(collectionSlug).toEqual({
        id: "5",
        baseSlug: "test",
        discriminator: 2,
        authorId: "1"
      });

      expect(
        // eslint-disable-next-line
        (service as any).prisma.collectionSlug.create
      ).toHaveBeenCalledWith({
        data: {
          id: "5",
          baseSlug: "test",
          discriminator: 2,
          author: {connect: {id: "1"}}
        }
      });
    });
  });

  describe("updateCollectionSlug", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should error if no collection slug is found", async () => {
      jest
        .spyOn(service, "getCollectionSlug")
        // eslint-disable-next-line @typescript-eslint/require-await
        .mockImplementation(async () => null);
      await expect(
        service.updateCollectionSlug({
          where: {id: "10"},
          data: {baseSlug: "test"}
        })
      ).rejects.toThrowError();
    });

    it("should update a collection slug", async () => {
      const collectionSlug = await service.updateCollectionSlug({
        where: {id: "1"},
        data: {baseSlug: "test"}
      });
      expect(collectionSlug).toEqual({
        id: "1",
        baseSlug: "test",
        discriminator: 2,
        authorId: "1"
      });

      expect(
        // eslint-disable-next-line
        (service as any).prisma.collectionSlug.update
      ).toHaveBeenCalledWith({
        where: {id: "1"},
        data: {baseSlug: "test", discriminator: 2}
      });
    });
  });
});
