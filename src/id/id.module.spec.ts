import {Test} from "@nestjs/testing";
import {IdModule} from "./id.module";
import {IdService} from "./id.service";

describe("IdModule", () => {
  it("should compile with all providers and imports", async () => {
    const module = await Test.createTestingModule({
      imports: [IdModule]
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(IdService)).toBeInstanceOf(IdService);
  });
});
