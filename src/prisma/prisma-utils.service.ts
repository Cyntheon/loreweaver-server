import {Injectable} from "@nestjs/common";
import {Prisma} from "@prisma/client";
import {IdService} from "../id";

@Injectable()
export class PrismaUtilsService {
  constructor(private idService: IdService) {}

  unpackStringFromSetObject(
    str: string | Prisma.StringFieldUpdateOperationsInput | undefined
  ): string | undefined {
    if (!str) {
      return undefined;
    }

    return typeof str === "string" ? str : str.set;
  }

  injectIdIntoData<T extends Record<string, unknown>>(
    data: T
  ): T & {id: string} {
    return {
      ...data,
      id: this.idService.generateId()
    };
  }

  injectIdIntoArgs<T extends Record<string, unknown>, A extends {data: T}>(
    args: A
  ): {data: T & {id: string}} {
    return {
      ...args,
      data: this.injectIdIntoData<T>(args.data)
    };
  }
}
