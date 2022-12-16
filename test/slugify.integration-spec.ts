import {Test} from "@nestjs/testing";
import {SlugService} from "../src/slug";

describe("SlugService (integration)", () => {
  let slugService: SlugService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SlugService]
    }).compile();

    slugService = moduleRef.get<SlugService>(SlugService);
  });

  describe("slugify", () => {
    it("should make all characters lowercase", () => {
      const text = "Foo BAR baZ";
      const slug = slugService.slugify(text);
      expect(slug).toBe("foo-bar-baz");
    });

    it("should replace spaces with dashes", () => {
      const text = "foo bar baz";
      const slug = slugService.slugify(text);
      expect(slug).toEqual("foo-bar-baz");
    });

    it("should replace multiple spaces with a single dash", () => {
      const text = "foo   bar      baz";
      const slug = slugService.slugify(text);
      expect(slug).toEqual("foo-bar-baz");
    });

    it("should replace multiple dashes with a single dash", () => {
      const text = "foo---bar-----baz";
      const slug = slugService.slugify(text);
      expect(slug).toEqual("foo-bar-baz");
    });

    it("should replace periods and underscores with dashes", () => {
      const text = "foo_bar.baz";
      const slug = slugService.slugify(text);
      expect(slug).toEqual("foo-bar-baz");
    });

    it("should trim leading and trailing whitespace", () => {
      const text = " foo bar baz   ";
      const slug = slugService.slugify(text);
      expect(slug).toEqual("foo-bar-baz");
    });

    it("should remove unexpected characters", () => {
      const text = `"$(fo+o{}@# /ba👻[r %^&❤️\\*baz]\`!';:~)`;
      const slug = slugService.slugify(text);
      expect(slug).toEqual("foo-bar-baz");
    });
  });
});
