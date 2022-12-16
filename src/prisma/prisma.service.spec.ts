import {Test} from "@nestjs/testing";
import {PrismaService} from ".";

describe("PrismaService", () => {
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService]
    }).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe("onModuleInit", () => {
    // spy on the $connect method
    const connectSpy = jest.spyOn(PrismaService.prototype, "$connect");

    it("should call the connect method", async () => {
      await prismaService.onModuleInit();
      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe("enableShutdownHooks", () => {
    const onSpy = jest.spyOn(PrismaService.prototype, "$on");

    it("should call the $on method", () => {
      // eslint-disable-next-line
      prismaService.enableShutdownHooks({close: () => {}} as any);
      expect(onSpy).toHaveBeenCalled();
    });
  });
});
