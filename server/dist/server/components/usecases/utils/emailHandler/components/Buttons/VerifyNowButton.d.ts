import { StringKeyObject } from '../../../../../../types/custom';
declare const VerifyNowButton: {
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
            get(): StringKeyObject;
        };
    };
};
export { VerifyNowButton };
