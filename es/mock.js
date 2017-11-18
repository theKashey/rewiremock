var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { convertName } from './plugins';
import getScope from './globals';

var ModuleMock = function () {
    function ModuleMock(mock) {
        _classCallCheck(this, ModuleMock);

        this.mock = mock;
        mock._parent = this;
    }

    _createClass(ModuleMock, [{
        key: 'nonStrict',
        value: function nonStrict() {
            return this;
        }
    }, {
        key: 'from',
        value: function from(source) {
            if (source instanceof ModuleMock) {
                var originalName = this.mock.name;
                Object.assign(this.mock, source.mock);
                this.mock.name = originalName;
            } else {
                return this.with(source);
            }
        }

        /**
         * Enabled call thought original module
         * @name ModuleMock.callThrough
         * @return {ModuleMock}
         */

    }, {
        key: 'callThrough',
        value: function callThrough() {
            this.mock.allowCallThrough = true;
            return this;
        }

        /**
         * Setting es6 behavior for a current module
         * @return {ModuleMock}
         */

    }, {
        key: 'es6',
        value: function es6() {
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

    }, {
        key: 'withDefault',
        value: function withDefault(stub) {
            this.with({ default: stub });
            return this.es6();
        }

        /**
         * Overriding export of a module
         * @param stubs
         * @return {ModuleMock}
         */

    }, {
        key: 'with',
        value: function _with(stubs) {
            if ((typeof stubs === 'undefined' ? 'undefined' : _typeof(stubs)) == 'object') {
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

    }, {
        key: 'by',
        value: function by(newTarget) {
            if (typeof newTarget == 'string') {
                this.mock.overrideBy = convertName(newTarget, getScope().parentModule);
            } else {
                this.mock.overrideBy = newTarget;
            }
            return this;
        }
    }, {
        key: 'disable',
        value: function disable() {
            this.mock.disabled = true;
            return this;
        }
    }, {
        key: 'enable',
        value: function enable() {
            this.mock.disabled = false;
            return this;
        }
    }, {
        key: 'directChildOnly',
        value: function directChildOnly() {
            this.mock.flag_directChildOnly = true;
            return this;
        }
    }, {
        key: 'atAnyPlace',
        value: function atAnyPlace() {
            this.mock.flag_directChildOnly = false;
            return this;
        }
    }, {
        key: 'calledFromMock',
        value: function calledFromMock() {
            this.mock.flag_toBeCalledFromMock = true;
            return this;
        }
    }, {
        key: 'calledFromAnywhere',
        value: function calledFromAnywhere() {
            this.mock.flag_toBeCalledFromMock = false;
            return this;
        }
    }, {
        key: 'toBeUsed',
        value: function toBeUsed() {
            this.mock.flag_toBeUsed = true;
            return this;
        }
    }, {
        key: 'notToBeUsed',
        value: function notToBeUsed() {
            this.mock.flag_toBeUsed = false;
            return this;
        }
    }]);

    return ModuleMock;
}();

ModuleMock.inlineConstructor = {};
Object.getOwnPropertyNames(ModuleMock.prototype).forEach(function (key) {
    ModuleMock.inlineConstructor[key] = function () {
        var mock = new ModuleMock({ value: {} });
        return mock[key].apply(mock, arguments);
    };
});

export default ModuleMock;