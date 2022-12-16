import {Test} from "@nestjs/testing";
import {PrismaUtilsService} from ".";
import {IdService} from "../id";

describe("PrismaUtilsService", () => {
  let service: PrismaUtilsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PrismaUtilsService,
        {
          provide: IdService,
          useValue: {
            generateId: jest.fn().mockReturnValue("1")
          }
        }
      ]
    }).compile();

    service = moduleRef.get<PrismaUtilsService>(PrismaUtilsService);
  });

  describe("unpackStringFromSetObject", () => {
    it("should return the string if it is a string", () => {
      expect(service.unpackStringFromSetObject("foo")).toEqual("foo");
    });

    it("should return the string if it is a set object", () => {
      expect(service.unpackStringFromSetObject({set: "bar"})).toEqual("bar");
    });
  });

  describe("injectIdIntoData", () => {
    it("should inject an id into data", () => {
      const data = service.injectIdIntoData({
        name: "foo",
        nickname: "bar"
      });
      expect(data).toEqual({
        id: "1",
        name: "foo",
        nickname: "bar"
      });
    });
  });

  describe("injectIdIntoArgs", () => {
    beforeEach(() => {
      jest.spyOn(service, "injectIdIntoData").mockImplementation((data) => ({
        ...data,
        // eslint-disable-next-line
        id: (service as any).idService.generateId() as string
      }));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should inject an id into args", () => {
      const args = service.injectIdIntoArgs({
        data: {
          name: "foo",
          nickname: "bar"
        },
        select: {
          name: true
        }
      });
      expect(args).toEqual({
        data: {
          id: "1",
          name: "foo",
          nickname: "bar"
        },
        select: {
          name: true
        }
      });
    });
  });
});
