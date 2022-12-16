import {Test} from "@nestjs/testing";
import slugify from "slugify";
import {SlugService} from ".";

const options = {
  lower: true,
  strict: true,
  trim: true
};

jest.mock("slugify", () => jest.fn().mockReturnValue("foo-bar-baz"));

describe("SlugService", () => {
  let slugService: SlugService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [SlugService]
    }).compile();

    slugService = moduleRef.get<SlugService>(SlugService);
  });

  describe("replaceDotsAndUnderscoresWithDashes", () => {
    it("should do nothing if the input string has no underscores or dots", () => {
      expect(slugService.replaceDotsAndUnderscoresWithDashes("foo")).toBe(
        "foo"
      );
    });

    it("should replace underscores with dashes", () => {
      expect(slugService.replaceDotsAndUnderscoresWithDashes("foo_bar")).toBe(
        "foo-bar"
      );
    });

    it("should replace dots with dashes", () => {
      expect(slugService.replaceDotsAndUnderscoresWithDashes("foo.bar")).toBe(
        "foo-bar"
      );
    });

    it("should replace both underscores and dots with dashes", () => {
      expect(
        slugService.replaceDotsAndUnderscoresWithDashes("foo_bar.baz")
      ).toBe("foo-bar-baz");
    });
  });

  describe("stripSpecialCharacters", () => {
    it("should do nothing if the input string has no special characters", () => {
      expect(slugService.stripSpecialCharacters("foo")).toBe("foo");
    });

    it("should strip special characters", () => {
      expect(slugService.stripSpecialCharacters("(f$%oo&*~.'\"!:@b+a)r")).toBe(
        "foobar"
      );
    });

    it("should not strip dashes", () => {
      expect(slugService.stripSpecialCharacters("foo-bar")).toBe("foo-bar");
    });
  });

  describe("slugify", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should call the slugify library after transforming the input string", () => {
      jest
        .spyOn(slugService, "stripSpecialCharacters")
        .mockReturnValue("FOO_Bar.Baz");
      jest
        .spyOn(slugService, "replaceDotsAndUnderscoresWithDashes")
        .mockReturnValue("FOO-Bar-Baz");

      slugService.slugify("FOO!_Bar#.Baz)");
      expect(slugify).toHaveBeenCalledWith("FOO-Bar-Baz", options);
    });
  });
});
