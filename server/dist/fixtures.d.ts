declare const mochaHooks: {
    beforeAll(): Promise<void>;
    afterAll(): Promise<void>;
};
declare const mochaGlobalSetup: () => Promise<void>;
export { mochaGlobalSetup, mochaHooks };
