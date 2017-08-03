interface OverloadedModule {
    name: String,
    fileName: String,
    parent: Object,
    original: Object
}
;

interface ModuleMock {
    /**
     * Enabled call thought original module
     */
    callThought(): ModuleMock,

    /**
     * Setting es6 bahavior for a module
     */
    es6(): ModuleMock,

    /**
     * Setting es6 behavior for a current module and overriding default export
     */
    withDefault(stubs: any): ModuleMock,

    /**
     * Overriding export of a module
     */
    with(stubs: any): ModuleMock,

    /**
     * Overriding export of one module by another
     */
    by(module: string): ModuleMock,
    /**
     * Overriding export of one module by something generated by a function
     */
    by(module: (OverloadedModule) => Object): ModuleMock,

    enable(): ModuleMock,
    disable(): ModuleMock,

    /**
     * mocks only first direct children.
     */
    directChildOnly(): ModuleMock;
    atAnyPlace(): ModuleMock;

    /**
     * mocks only if parent were mocked
     */
    calledFromMock(): ModuleMock;
    calledFromAnywhere(): ModuleMock;
    /**
     * Force mock to be used, or throw an error otherwise
     */
    toBeUsed(): ModuleMock,

    noToBeUsed(): ModuleMock
}
/**
 * @name rewiremock
 * @class
 * Proxies imports/require in order to allow overriding dependencies during testing.
 */
interface rewiremock {
    (module: string): ModuleMock;

    enable();
    disable();

    /**
     * executes module in a sanbox
     * @param {Function} loader - loader of target module. You can use import or require. May return a Promise
     * @param {Function} [creator] - mock creator. You may add any mocks inside.
     */
    around<T>(loader: () => T, creator?: Function): Promise<T>;
    inScope(callback);

    flush();
    clear();
    /**
     * converts module name
     * @param module
     */
    resolve(module: string): string,

    /**
     * Activates module isolation
     * @param {Boolean} [options.noAutoPassBy] includes mocked modules to a isolation scope. Usage with mock.callThought.
     */
    isolation(options?: Object);

    /**
     * Deactivates isolation
     */
    withoutIsolation();

    /**
     * Adding new isolationpassby record
     */
    passBy(pattern: any);
}

declare module 'rewiremock' {
    var p: rewiremock;
    export = p;
}