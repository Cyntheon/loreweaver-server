import {Injectable} from "@nestjs/common";
import slugify from "slugify";

@Injectable()
export class SlugService {
  constructor() {}

  slugify(text: string): string {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true
    });
  }

  calculateSlug({
    baseSlug,
    discriminator = 0
  }: {
    baseSlug: string;
    discriminator?: number;
  }): string {
    return `${baseSlug}${discriminator > 0 ? `.${discriminator}` : ""}`;
  }

  findLowestAvailableDiscriminator(
    modelsWithSameBaseSlug: {slugDiscriminator: number}[],
    {preSorted = false}
  ) {
    if (modelsWithSameBaseSlug.length === 0) {
      return 0;
    }

    const orderedModels = preSorted
      ? modelsWithSameBaseSlug
      : modelsWithSameBaseSlug.sort(
          (a, b) => a.slugDiscriminator - b.slugDiscriminator
        );

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < orderedModels.length; i++) {
      const modelWithThisDuplicateCount = orderedModels.find(
        ({slugDiscriminator}) => slugDiscriminator === i
      );

      if (!modelWithThisDuplicateCount) {
        return i;
      }
    }

    return orderedModels[orderedModels.length - 1].slugDiscriminator + 1;
  }
}
