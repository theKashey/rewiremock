import {convertName} from './plugins';
import getScope from './globals';

class ModuleMock {
    constructor(mock) {
        this.mock = mock;
        mock._parent = this;
    }

    nonStrict() {
        return this;
    }

    from(source){
        if(source instanceof  ModuleMock){
            const originalName = this.mock.name;
            Object.assign(this.mock, source.mock);
            this.mock.name= originalName;
        } else {
            return this.with(source);
        }
    }

    /**
     * Enabled call thought original module
     * @name ModuleMock.callThrough
     * @return {ModuleMock}
     */
    callThrough() {
        this.mock.allowCallThrough = true;
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
     * @param {String|Function} newTarget
     * @return {ModuleMock}
     */
    by(newTarget) {
        if (typeof newTarget == 'string') {
            this.mock.overrideBy = convertName(newTarget, getScope().parentModule);
        } else {
            this.mock.overrideBy = newTarget;
        }
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

    directChildOnly() {
        this.mock.flag_directChildOnly = true;
        return this;
    }

    atAnyPlace() {
        this.mock.flag_directChildOnly = false;
        return this;
    }

    calledFromMock() {
        this.mock.flag_toBeCalledFromMock = true;
        return this;
    }

    calledFromAnywhere() {
        this.mock.flag_toBeCalledFromMock = false;
        return this;
    }

    toBeUsed() {
        this.mock.flag_toBeUsed = true;
        return this;
    }

    toMatchOrigin(){
        this.mock.matchOrigin = true;
        return this;
    }

    notToBeUsed() {
        this.mock.flag_toBeUsed = false;
        return this;
    }
}

ModuleMock.inlineConstructor = {};
Object.getOwnPropertyNames(ModuleMock.prototype).forEach( key => {
  ModuleMock.inlineConstructor[key] = function(...args) {
    const mock = new ModuleMock({value:{}});
    return mock[key](...args);
  }
});

export default ModuleMock;