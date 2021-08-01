class NGramHandler {
  public createEdgeNGrams = (props: { str: string; isPrefixOnly: boolean }) => {
    const { str, isPrefixOnly } = props;
    if (str && str.length > 1) {
      const splitOnSpace = str.split(' ');
      if (isPrefixOnly) {
        const hasSpace = splitOnSpace.length > 1;
        const spliceIndex = hasSpace ? 1 : 0;
        return splitOnSpace
          .reverse()
          .splice(spliceIndex)
          .reduce((ngrams: any, token) => {
            return this._processNGrams(str, ngrams, token);
          }, [])
          .join(' ');
      } else {
        return splitOnSpace
          .reduce((ngrams: any, token) => {
            return this._processNGrams(str, ngrams, token);
          }, [])
          .join(' ');
      }
    }
  };

  private _processNGrams = (str: string, ngrams: string[], token: any) => {
    const minGram = 1;
    const maxGram = str.length;
    if (token.length > minGram) {
      for (let i = minGram; i <= maxGram && i <= token.length; ++i) {
        ngrams = [...ngrams, token.substr(0, i)];
      }
    } else {
      ngrams = [...ngrams, token];
    }
    return ngrams;
  };
}

export { NGramHandler };
