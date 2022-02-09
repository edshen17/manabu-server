declare const EmailButton: {
    template: string;
    name: string;
    components: {};
    props: {
        paddingTop: {
            type: StringConstructor;
            required: boolean;
            default: string;
        };
        isServerEndpoint: {
            type: BooleanConstructor;
            required: boolean;
            default: boolean;
        };
        endpoint: {
            type: StringConstructor;
            required: boolean;
        };
        text: {
            type: StringConstructor;
            required: boolean;
        };
    };
    data(): {};
    computed: {
        href: {
            get(): string;
        };
    };
};
export { EmailButton };
