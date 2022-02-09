declare class NGramHandler {
    createEdgeNGrams: (props: {
        str: string;
        isPrefixOnly: boolean;
    }) => any;
    private _processNGrams;
}
export { NGramHandler };
