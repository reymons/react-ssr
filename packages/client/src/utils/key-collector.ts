type Data<T extends string> = {
  [K in T]: any;
};

class KeyCollector<T extends string, D = Data<T>> {
  private keys;
  private callback;
  private size;
  private collection: D;

  constructor(keys: T[], callback: (data: D) => void) {
    this.keys = keys;
    this.callback = callback;
    this.size = 0;
    this.collection = {} as D;
  }

  collect(key: keyof D, value: any) {
    this.collection[key] = value;
    this.size++;
    if (this.size === this.keys.length) {
      this.callback(this.collection);
    }
  }
}

export { KeyCollector };
