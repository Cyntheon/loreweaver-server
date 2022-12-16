import {Injectable} from "@nestjs/common";
import {GenericSlug} from "../@types";

@Injectable()
export class DiscriminatorService {
  constructor() {}

  appendDiscriminatorToSlug({
    baseSlug,
    discriminator = 1
  }: GenericSlug): string {
    return `${baseSlug}${discriminator > 1 ? `_${discriminator}` : ""}`;
  }

  orderByDiscriminator(array: {discriminator: number}[]) {
    return array.sort((a, b) => a.discriminator - b.discriminator);
  }

  findLowestAvailableDiscriminator(
    modelsWithSameBaseSlug: {discriminator: number}[],
    {preSorted = false} = {}
  ) {
    if (modelsWithSameBaseSlug.length === 0) {
      return 1;
    }

    const orderedModels = preSorted
      ? modelsWithSameBaseSlug
      : this.orderByDiscriminator(modelsWithSameBaseSlug);

    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= orderedModels.length; i++) {
      const modelWithThisDuplicateCount = orderedModels.find(
        ({discriminator}) => discriminator === i
      );

      if (!modelWithThisDuplicateCount) {
        return i;
      }
    }

    return orderedModels[orderedModels.length - 1].discriminator + 1;
  }
}
