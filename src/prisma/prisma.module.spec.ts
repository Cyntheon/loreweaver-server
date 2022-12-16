import {Test} from "@nestjs/testing";
import {PrismaModule, PrismaService} from ".";

describe("PrismaModule", () => {
  it("should compile with all providers and imports", async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule]
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(PrismaService)).toBeInstanceOf(PrismaService);
  });
});
