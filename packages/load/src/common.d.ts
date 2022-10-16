type Chunk = {
  filename: string;
  isEntry: boolean;
};

export type Manifest = Record<string, Chunk[]>;
