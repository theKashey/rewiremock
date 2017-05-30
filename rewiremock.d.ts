/**
 * @name rewiremock
 * @class
 * Proxies imports/require in order to allow overriding dependencies during testing.
 */
interface rewiremock {
    (module: string): rewiremock;


    enable();
    disable();

    flush();
    clear();
    /**
     * converts module name
     * @param module
     */
    resolve(module: string): string,

    /**
     * Enabled call thought original module
     */
    callThought(): rewiremock,

    /**
     * Setting es6 bahavior for a module
     */
    es6(): rewiremock,

    /**
     * Setting es6 behavior for a current module and overriding default export
     */
    withDefault(stubs: any): rewiremock,

    /**
     * Overriding export of a module
     */
    with(stubs: any): rewiremock,

    /**
     * Overriding export of one module by another
     */
    by(module: string): rewiremock,

    /**
     * Activates module isolation
     */
    isolation();

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