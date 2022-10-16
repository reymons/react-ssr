import { Manifest } from "./common";

export function getChunkFilenames(
  requests: string[],
  manifest: Manifest,
  includeEntry?: boolean
) {
  const css: string[] = [];
  const js: string[] = [];
  /** Create cache to prevent double adding
   * of the same filename to js / css array **/
  const cache: Record<string, boolean> = {};

  for (const request in manifest) {
    const chunks = manifest[request];
    const hasRequest = requests.includes(request);

    chunks.forEach(({ isEntry, filename }) => {
      if (cache[filename]) {
        return;
      }

      cache[filename] = true;

      if (hasRequest || (isEntry && includeEntry)) {
        if (/\.m?js$/.test(filename)) {
          js.push(filename);
        } else if (/\.css$/.test(filename)) {
          css.push(filename);
        }
      }
    });
  }

  return { css, js };
}
