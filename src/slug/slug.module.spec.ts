import {Test} from "@nestjs/testing";
import {SlugModule, SlugResolver, SlugService} from ".";

describe("SlugModule", () => {
  it("should compile with all providers and imports", async () => {
    const module = await Test.createTestingModule({
      imports: [SlugModule]
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(SlugService)).toBeInstanceOf(SlugService);
    expect(module.get(SlugResolver)).toBeInstanceOf(SlugResolver);
  });
});
