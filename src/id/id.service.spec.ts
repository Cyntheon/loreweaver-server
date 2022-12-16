import {Test} from "@nestjs/testing";
import {IdService} from ".";

jest.mock("uuid", () => ({
  v4: jest.fn().mockReturnValue("12345678-abcd-1234-abcd-1234567890ef")
}));

describe("IdService", () => {
  let idService: IdService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [IdService]
    }).compile();

    idService = moduleRef.get<IdService>(IdService);
  });

  describe("generateUuid", () => {
    it("should generate a uuid", () => {
      const id = idService.generateId();
      expect(id).toEqual("12345678-abcd-1234-abcd-1234567890ef");
    });
  });
});
