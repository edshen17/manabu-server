/// <reference types="custom" />
import { StringKeyObject } from '../../../../../types/custom';
declare const TeacherAppointmentUpdate: {
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
        ViewLessonButton: {
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
                appointment: {
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
        appointment: {
            type: ObjectConstructor;
            required: boolean;
        };
    };
    data(): {};
    computed: {
        processedAppointmentData: {
            get(): StringKeyObject;
        };
        rowData: {
            get(): StringKeyObject[];
        };
    };
};
export { TeacherAppointmentUpdate };
