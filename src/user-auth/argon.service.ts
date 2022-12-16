import {Injectable} from "@nestjs/common";
import argon2, {argon2d, argon2i, argon2id} from "argon2";

@Injectable()
export class ArgonService {
  constructor() {}

  async hash(plain: string, salt: string) {
    return argon2.hash(plain, {
      type: argon2id,
      hashLength: 32,
      saltLength: 128,
      parallelism: 2,
      timeCost: 8,
      memoryCost: 4096,
      salt: Buffer.from(salt, "utf-8"),
      secret: Buffer.from(process.env.ARGON_SECRET as string, "utf-8")
    });
  }

  splitHash(hash: string) {
    const [type, version, options, salt] = hash.split("$");

    return {type, version, options, salt};
  }

  typeToNumber(type: string) {
    return {
      argon2i,
      argon2d,
      argon2id
    }[type];
  }

  async verify(hash: string, plain: string) {
    const {type, version, options, salt} = this.splitHash(hash);

    return argon2.verify(hash, plain, {
      type: this.typeToNumber(type),
      version: Number.parseInt(version.split("v=")[0], 10),
      hashLength: 32,
      saltLength: 128,
      parallelism: Number.parseInt(options.match(/p=?(\d*)/)?.[1] || "2", 10),
      timeCost: Number.parseInt(options.match(/t=?(\d*)/)?.[1] || "8", 10),
      memoryCost: Number.parseInt(options.match(/m=?(\d*)/)?.[1] || "4096", 10),
      salt: Buffer.from(salt, "utf-8"),
      secret: Buffer.from(process.env.ARGON_SECRET as string, "utf-8")
    });
  }
}
