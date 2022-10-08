export type Manifest = Record<
  string,
  {
    request: string;
    isEntry: boolean;
  }
>;
