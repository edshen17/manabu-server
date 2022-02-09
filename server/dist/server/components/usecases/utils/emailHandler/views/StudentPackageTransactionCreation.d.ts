/// <reference types="custom" />
import { PackageTransactionDoc } from '../../../../../models/PackageTransaction';
import { StringKeyObject } from '../../../../../types/custom';
declare const StudentPackageTransactionCreation: {
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
        ViewLessonPlanButton: {
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
                packageTransaction: {
                    type: ObjectConstructor;
                    required: boolean;
                };
            };
            data(): {};
            computed: {
                buttonProps: {
                    get(): StringKeyObject;
                };
            };
        };
    };
    props: {
        name: {
            type: StringConstructor;
            required: boolean;
        };
        balanceTransaction: {
            type: ObjectConstructor;
            required: boolean;
        };
    };
    data(): {};
    computed: {
        rowData: {
            get(): StringKeyObject[];
        };
        packageTransaction: {
            get(): PackageTransactionDoc;
        };
    };
};
export { StudentPackageTransactionCreation };
