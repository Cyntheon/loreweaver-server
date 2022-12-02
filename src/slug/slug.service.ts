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
}
