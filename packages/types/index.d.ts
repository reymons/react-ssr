declare var __config__: {
  assetsPath: {
    fonts: string;
    images: string;
  };
  chunksPath: {
    js: string;
    css: string;
  };
  resolvers: {
    client: Record<string, string>;
  };
  regExp: {
    font: RegExp;
    image: RegExp;
  };
};

declare function __resolve_client__(...dist: string[]): string;

declare function __resolve_dist__(...dist: string[]): string;

declare function __resolve_root__(...dist: string[]): string;

declare function __asset_name__(filepath: string): string;

declare function __css_module_name__(name: string, filepath: string): string;
