declare const Email: {
    template: string;
    name: string;
    components: {
        EmailHead: {
            template: string;
            name: string;
            components: {};
            props: {};
            data(): {};
            computed: {};
        };
        Logo: {
            template: string;
            name: string;
            components: {};
            props: {};
            data(): {};
            computed: {};
        };
        EmailBody: {
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
        Social: {
            template: string;
            name: string;
            components: {};
            props: {};
            data(): {};
            computed: {
                iconData: {
                    get(): {
                        name: string;
                        link: string;
                    }[];
                };
            };
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
export { Email };
