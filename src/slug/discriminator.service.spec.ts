import {Test} from "@nestjs/testing";
import {DiscriminatorService} from "./discriminator.service";

describe("DiscriminatorService", () => {
  let service: DiscriminatorService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DiscriminatorService]
    }).compile();

    service = moduleRef.get<DiscriminatorService>(DiscriminatorService);
  });

  describe("appendDiscriminatorToSlug", () => {
    it("should append the given discriminator to the given slug for values greater than 1", () => {
      expect(
        service.appendDiscriminatorToSlug({
          baseSlug: "foo-bar-baz",
          discriminator: 3
        })
      ).toBe("foo-bar-baz_3");
    });

    it("shouldn't append if the given discriminator is 1", () => {
      expect(
        service.appendDiscriminatorToSlug({
          baseSlug: "foo-bar-baz",
          discriminator: 1
        })
      ).toBe("foo-bar-baz");
    });
  });

  describe("orderByDiscriminator", () => {
    it("should sort the given array by discriminator", () => {
      const array = [
        {discriminator: 3},
        {discriminator: 1},
        {discriminator: 2},
        {discriminator: 4}
      ];
      const expected = [
        {discriminator: 1},
        {discriminator: 2},
        {discriminator: 3},
        {discriminator: 4}
      ];

      expect(service.orderByDiscriminator(array)).toEqual(expected);
    });
  });

  describe("findLowestAvailableDiscriminator", () => {
    let orderBySpy: jest.SpyInstance;

    beforeEach(() => {
      orderBySpy = jest
        .spyOn(service, "orderByDiscriminator")
        .mockImplementation((array) => array);
    });

    afterEach(() => {
      orderBySpy.mockReset();
    });

    it("should return 1 if the given array is empty", () => {
      expect(service.findLowestAvailableDiscriminator([])).toBe(1);
    });

    it("should return 1 if the given array does not have a 1", () => {
      expect(
        service.findLowestAvailableDiscriminator([
          {discriminator: 2},
          {discriminator: 3}
        ])
      ).toBe(1);
    });

    it("should return 2 if the given array has a 1 but not a 2", () => {
      expect(
        service.findLowestAvailableDiscriminator([
          {discriminator: 1},
          {discriminator: 3}
        ])
      ).toBe(2);
    });

    it("should work with pre-sorted arrays", () => {
      expect(
        service.findLowestAvailableDiscriminator(
          [{discriminator: 1}, {discriminator: 2}],
          {preSorted: true}
        )
      ).toBe(3);
    });

    it("should work when the given array is not pre-sorted", () => {
      orderBySpy.mockReturnValue([
        {discriminator: 1},
        {discriminator: 2},
        {discriminator: 3},
        {discriminator: 5}
      ]);

      expect(
        service.findLowestAvailableDiscriminator([
          {discriminator: 3},
          {discriminator: 1},
          {discriminator: 2},
          {discriminator: 5}
        ])
      ).toBe(4);
    });

    it("should work with large arrays", () => {
      const array = Array.from({length: 1000}, (_, i) => ({
        discriminator: i + 1
      })).filter(({discriminator}) => discriminator !== 500);

      expect(service.findLowestAvailableDiscriminator(array)).toBe(500);
    });
  });
});
