import {Injectable} from "@nestjs/common";
import slugify from "slugify";
import {GenericSlug} from "../@types";

@Injectable()
export class SlugService {
  constructor() {}

  replaceDotsAndUnderscoresWithDashes(text: string): string {
    return text.replace(/[._]/g, "-");
  }

  stripSpecialCharacters(text: string): string {
    return text.replace(/[$%&*+~.()'"!:@]/g, "");
  }

  slugify(text: string): string {
    const transformedText = this.replaceDotsAndUnderscoresWithDashes(
      this.stripSpecialCharacters(text)
    );

    return slugify(transformedText, {
      lower: true,
      strict: true,
      trim: true
    });
  }
}
