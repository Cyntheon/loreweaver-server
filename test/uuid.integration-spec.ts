import {Test} from "@nestjs/testing";
import {IdService} from "../src/id";

describe("IdService (integration)", () => {
  let idService: IdService;

  beforeEach(async () => {
    jest.restoreAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [IdService]
    }).compile();

    idService = moduleRef.get<IdService>(IdService);
  });

  describe("generateUuid", () => {
    it("should generate a string with length 36", () => {
      const uuid = idService.generateId();
      expect(uuid.length).toBe(36);
    });

    it("should generate a string with 4 dashes", () => {
      const uuid = idService.generateId();
      expect(uuid.match(/-/g)?.length).toBe(4);
    });

    it("should generate a string with 32 alphanumerics", () => {
      const uuid = idService.generateId();
      expect(uuid.match(/[a-z0-9]/g)?.length).toBe(32);
    });

    it("should generate different uuids with no collisions", () => {
      const num = 1_000_000;
      const uuids = new Set();
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < num; i++) {
        uuids.add(idService.generateId());
      }
      expect(uuids.size).toBe(num);
    });
  });
});
