import {Prisma} from "@prisma/client";

export type PickPartial<T, K> = Partial<Pick<T, K>> & Omit<T, K>;

export type PickRequired<T, K> = Required<Pick<T, K>> & Omit<T, K>;

export type Override<A, B> = Omit<A, keyof B> & B;

export interface GenericSlug {
  baseSlug: string;
  discriminator: number;
}

// export type PrismaCreateArgs<
//  ModelName extends string,
//  KeysToOmit extends string = never
// > = Override<
//  Prisma[`${ModelName}CreateArgs`],
//  {
//    data: PickPartial<Prisma[`${ModelName}CreateInput`], KeysToOmit | "id">;
//  }
// >;

export type PrismaCreateInput<
  CreateInput,
  KeysToOmit extends string = never
> = PickPartial<CreateInput, KeysToOmit | "id">;

export type PrismaCreateArgs<
  CreateArgs,
  CreateInput,
  KeysToOmit extends string = never
> = Override<CreateArgs, {data: PrismaCreateInput<CreateInput, KeysToOmit>}>;

// export type ModelCreateInput<
//   ModelName extends string,
//   KeysToOmit extends string = never
// > = PrismaCreateInput<Prisma[`${ModelName}CreateInput`], KeysToOmit>;
//
// export type ModelCreateArgs<
//   ModelName extends string,
//   KeysToOmit extends string = never
// > = PrismaCreateArgs<
//   Prisma[`${ModelName}CreateArgs`],
//   ModelCreateInput<ModelName, KeysToOmit>,
//   KeysToOmit
// >;
