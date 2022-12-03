export function stringOrSetObjectToString(s: string | {set: string}): string {
  return typeof s === "string" ? s : s.set;
}
