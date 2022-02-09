declare const EmailBody: {
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
    props: {
        name: {
            type: StringConstructor;
            required: boolean;
        };
    };
    data(): {};
    computed: {};
};
export { EmailBody };
