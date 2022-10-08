import { Manifest } from "./common";

export function getChunkFilenames(
  requests: string[],
  manifest: Manifest,
  includeEntry?: boolean
) {
  const css: string[] = [];
  const js: string[] = [];

  Object.entries(manifest).forEach(([chunkFilename, data]) => {
    const { isEntry, request } = data;

    if (requests.includes(request) || (includeEntry && isEntry)) {
      if (/\.m?js$/.test(chunkFilename)) {
        js.push(chunkFilename);
      } else if (/\.css$/.test(chunkFilename)) {
        css.push(chunkFilename);
      }
    }
  });

  return { css, js };
}
