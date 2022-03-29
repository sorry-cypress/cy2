import fs from 'fs';

function pathExists(path: string) {
  try {
    fs.statSync(path);
    return true;
  } catch (error) {
    return false;
  }
}

export const lookupPaths = (candidates: string[] = []) =>
  candidates.find((p) => pathExists(p));
