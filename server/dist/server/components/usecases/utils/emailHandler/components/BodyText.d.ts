declare const BodyText: {
    template: string;
    name: string;
    components: {
        Salutation: {
            template: string;
            name: string;
            components: {};
            props: {
                name: {
                    type: StringConstructor;
                    required: boolean;
                };
            };
            data(): {};
            computed: {};
        };
        Signature: {
            template: string;
            name: string;
            components: {};
            props: {};
            data(): {};
            computed: {};
        };
    };
    props: {};
    data(): {};
    computed: {};
};
export { BodyText };
