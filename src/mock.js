import {convertName} from './plugins';

class ModuleMock {
    constructor(mock) {
        this.mock = mock;
    }

    /**
     * Enabled call thought original module
     * @name ModuleMock.callThought
     * @return {ModuleMock}
     */
    callThought() {
        this.mock.allowCallThought = true;
        return this;
    }

    /**
     * Setting es6 behavior for a current module
     * @return {ModuleMock}
     */
    es6() {
        Object.defineProperty(this.mock.value, "__esModule", {
            value: true
        });
        return this;
    }

    /**
     * Setting es6 behavior for a current module and overriding default export
     * @param stub
     * @return {ModuleMock}
     */
    withDefault(stub) {
        this.with({default: stub});
        return this.es6();
    }

    /**
     * Overriding export of a module
     * @param stubs
     * @return {ModuleMock}
     */
    with(stubs) {
        if (typeof stubs == 'object') {
            this.mock.value = Object.assign(this.mock.value, stubs);
        } else {
            this.mock.value = Object.assign(stubs, this.mock.value);
        }

        return this;
    }

    /**
     * Overriding export of one module by another
     * @param {String} name
     * @return {ModuleMock}
     */
    by(name) {
        this.mock.overrideBy = convertName(name, parentModule);
        return this;
    }

    disable() {
        this.mock.disabled = true;
        return this;
    }

    enable() {
        this.mock.disabled = false;
        return this;
    }
}

export default ModuleMock;