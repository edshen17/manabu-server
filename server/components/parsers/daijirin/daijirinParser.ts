class DaijirinParser {
  private _fsPromises!: any;

  public parse = async (): Promise<void> => {
    const fileNames: string[] = await this._fsPromises.readdir('../data/daijirin');
    for (const fileName of fileNames) {
      if (fileName.includes('term_bank')) {
        const bufferJson = await this._fsPromises.readFile(`../data/daijirin/${fileName}`);
        const json = JSON.parse(bufferJson);
      }
    }
  };

  public init = async (initParams: { fs: any }): Promise<this> => {
    const { fs } = initParams;
    this._fsPromises = fs.promises;
    return this;
  };
}

export { DaijirinParser };
