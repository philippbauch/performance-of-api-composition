import path from "path";

const currentPathSplit = __dirname.split(path.sep);
export const projectRoot = currentPathSplit
  .slice(0, currentPathSplit.indexOf("services"))
  .join(path.sep);
