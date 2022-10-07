export function getChunkFilenames(requests, manifest, includeEntry) {
  const css = [];
  const js = [];

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
