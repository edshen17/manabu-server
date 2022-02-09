/// <reference types="custom" />
declare const EmailVerification: {
    template: string;
    name: string;
    components: {
        Email: {
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
        BodyText: {
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
        VerifyNowButton: {
            template: string;
            name: string;
            components: {
                EmailButton: {
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
            };
            props: {
                verificationToken: {
                    type: StringConstructor;
                    required: boolean;
                };
            };
            data(): {};
            computed: {
                buttonProps: {
                    get(): import("../../../../../types/custom").StringKeyObject;
                };
            };
        };
        EmailTable: {
            template: string;
            name: string;
            components: {};
            props: {
                rowData: {
                    type: ArrayConstructor;
                    default: never[];
                    required: boolean;
                };
            };
            data(): {};
            computed: {};
        };
    };
    props: {
        name: {
            type: StringConstructor;
            required: boolean;
        };
        verificationToken: {
            type: StringConstructor;
            required: boolean;
        };
    };
    data(): {};
    computed: {};
};
export { EmailVerification };
