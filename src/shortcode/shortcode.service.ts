import {Injectable} from "@nestjs/common";
import {Prisma, Shortcode} from "@prisma/client";
import {GraphQLError} from "graphql/error";
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class ShortcodeService {
  constructor(private prisma: PrismaService) {}

  private generateShortcodeString() {
    const validCharacters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 7;

    let shortcodeString = "";
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      shortcodeString += validCharacters.charAt(
        Math.floor(Math.random() * validCharacters.length)
      );
    }
    return shortcodeString;
  }

  async generateUniqueShortcode() {
    let shortcode = this.generateShortcodeString();
    let existing = await this.getShortcode({
      where: {id: shortcode}
    });

    while (existing) {
      shortcode = this.generateShortcodeString();
      // eslint-disable-next-line no-await-in-loop
      existing = await this.getShortcode({
        where: {id: shortcode}
      });
    }

    return shortcode;
  }

  async getShortcode(
    args: Prisma.ShortcodeFindUniqueArgs
  ): Promise<Shortcode | null> {
    return this.prisma.shortcode.findUnique(args);
  }

  async getShortcodeUrl(
    where: Prisma.ShortcodeWhereUniqueInput
  ): Promise<string> {
    const shortcode = await this.prisma.shortcode.findUnique({
      where,
      select: {
        id: true
      }
    });

    if (!shortcode) {
      throw new GraphQLError("Shortcode not found", {
        extensions: {code: "NOT_FOUND"}
      });
    }

    return `/s/${shortcode.id}`;
  }

  async createShortcode(args: Prisma.ShortcodeCreateArgs): Promise<Shortcode> {
    return this.prisma.shortcode.create({
      ...args,
      data: {
        ...args.data,
        id: await this.generateUniqueShortcode()
      }
    });
  }

  async updateShortcode(args: Prisma.ShortcodeUpdateArgs): Promise<Shortcode> {
    return this.prisma.shortcode.update(args);
  }

  async deleteShortcode(args: Prisma.ShortcodeDeleteArgs): Promise<Shortcode> {
    return this.prisma.shortcode.delete(args);
  }
}
