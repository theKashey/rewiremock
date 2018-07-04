# rewiremock 
[![Build Status](https://secure.travis-ci.org/theKashey/rewiremock.svg)](http://travis-ci.org/theKashey/rewiremock)
[![coverage-badge](https://img.shields.io/codecov/c/github/thekashey/rewiremock.svg?style=flat-square)](https://codecov.io/github/thekashey/rewiremock)
[![version-badge](https://img.shields.io/npm/v/rewiremock.svg?style=flat-square)](https://www.npmjs.com/package/rewiremock)
[![Greenkeeper badge](https://badges.greenkeeper.io/theKashey/rewiremock.svg)](https://greenkeeper.io/)

The most powerful mocking library, inspired by the best libraries:
- [mockery](https://github.com/mfncooper/mockery) - Rewiremock __is__ a better mockery.
- [proxyquire](https://github.com/theKashey/proxyquire) -Rewiremock __is__ it a better proxyquire.
- [mock-require](https://github.com/boblauer/mock-require) - Things must not be complex, Rewiremock __is__ not.
- [jest.mocks](https://facebook.github.io/jest/docs/en/manual-mocks.html) - Jest is awesome. But rewiremock can do the same.

Rewiremock __is a your favorite library__. The better version of it. For mocha, ava, karma, and anything not-jest.

```text
                     /$$      /$$ /$$                     /$$      /$$                     /$$      
                    | $$  /$ | $$|__/                    | $$$    /$$$                    | $$      
  /$$$$$$   /$$$$$$ | $$ /$$$| $$ /$$  /$$$$$$   /$$$$$$ | $$$$  /$$$$  /$$$$$$   /$$$$$$$| $$   /$$
 /$$__  $$ /$$__  $$| $$/$$ $$ $$| $$ /$$__  $$ /$$__  $$| $$ $$/$$ $$ /$$__  $$ /$$_____/| $$  /$$/
| $$  \__/| $$$$$$$$| $$$$_  $$$$| $$| $$  \__/| $$$$$$$$| $$  $$$| $$| $$  \ $$| $$      | $$$$$$/ 
| $$      | $$_____/| $$$/ \  $$$| $$| $$      | $$_____/| $$\  $ | $$| $$  | $$| $$      | $$_  $$ 
| $$      |  $$$$$$$| $$/   \  $$| $$| $$      |  $$$$$$$| $$ \/  | $$|  $$$$$$/|  $$$$$$$| $$ \  $$
|__/       \_______/|__/     \__/|__/|__/       \_______/|__/     |__/ \______/  \_______/|__/  \__/
```

By its nature rewiremock has same behavior as Mockery. But it can behave like others too.
It covers _any_ case. It is the right way to mock your dependencies or perform dependency injection.
 
# Goal:
- give ability to mock everything - CommonJS, ES6, inside nodejs or webpack.
- give ability to do correctly - isolation, typechecking, powerfull API
- give ability to do it easy - simple API to cover all the cases.

I have wrote some articles about these ideas - https://medium.com/tag/rewiremock/latest

# API
 
 ## main API
 - rewiremock.enable() - wipes cache and enables interceptor.
 - rewiremock.disable() - wipes cache and disables interceptor.    
 - rewiremock.around(loader, creator):Promise< T > - loads a module in an **asynchronous** sandbox.
 - rewiremock.proxy(file, stubs):T - _proxyquire_ like mocking api, where file is file name, and stubs are an object or a function.
 - rewiremock.module(loader, stubs):Promise< T > - async version of proxy, where loader is a function.
 ## mocking API 
 - rewiremock(moduleName: string) - fabric for a moduleNames's mock
 - rewiremock(moduleImport: loader) - async fabric for a module import function.
    - .enable/disable() - to enable or disable mock (enabled by default).
    - .with(stubs: function | Object) - overloads module with a value
    - .withDefault(stub: function | Object) - overload `default` es6 export
    - .es6() - marks module as ES6( __esModule )
    - .by(otherModule: string| function) - overload by another module(if string provider) or by result of a function call. 
    - .callThrough() - first load the original module, and next extend it by provided stub.
    - .mockThrough([stubFactory]) - first load the original module, and then replaces all exports by stubs.
    - .dynamic - enables hot mock updates.     
    - .toBeUsed() - enables usage checking.  
    - .directChildOnly - will do mock only direct dependencies.
    - .calledFromMock - will do mock only dependencies of mocked dependencies.    
 - rewiremock.getMock(moduleName: string|loader) - returns existing mock (_rewiremock(moduleName)_ will _override_)   
 ## isolation API
 - rewiremock.isolation() - enables isolation
 - rewiremock.withoutIsolation() - disables isolation
 - rewiremock.passBy(pattern or function) - enables some modules to pass throught isolation.
 ## sandboxing
 - rewiremock.inScope(callback) - place synchronous callback inside a sandbox.
 ## helper functions
 - rewiremock.stubFactory(factory) - define a stub factory for mockThrough command.

 ### Automocking
 Rewiremock supports (inspired by [Jest](https://facebook.github.io/jest/docs/en/manual-mocks.html)) auto `__mocks__`ing.
 
 Just create `__mocks__/fileName.js`, and `fileName.js` will be replaced by mock. Please refer to Jest documentation for use cases.
 
 If you dont want some file to be replaced by mock - add it, and then - disable
```js
 rewiremock('fileName.js').disable();
```

# Which API to use?
Yep - there is 4 top level ways to activate a mock - inScope, around, proxy or just enable.

### 2 different APIs
 - (jest) one could mock everything, but requires babel plugin. And there is one way to use it. Refer to Hoisted mocking.
 - (common) second will _require_ a file, overriding dependencies. And there are many ways to use it. 

### A common way to mock.
Rewiremock provides lots of APIs to help you setup mock, and get the mocked module.  
  - If everything is simple - use __rewiremock.proxy__. (~proxyquire)
  - If you have issues with name resolve - use __rewiremock.module__ and resolve names by yourself.
  - If you need scope isolation - use __rewiremock.around__, or inScope.
  - If you advanced syntax and type checking - use __rewiremock.around__.
  - You always can just use __.enable/.disable__ (~ mockery).
  
> All the mocks await you to provide "stubs" to override the real implimentation.
> If you want just to ensure you have called endpoints – use rewiremock('someFile').mockThrough.    

# Usage

- `proxy` will load a file by it's own ( keep in mind - name resolution is a complex thing)

```js
const mock = rewiremock.proxy('somemodule', (r) => ({
   'dep1': { name: 'override' },
   'dep2': r.with({name: 'override' }).toBeUsed().directChildOnly(), // use all `mocking API`
   'dep3': r.mockThrough() // automatically create a test double  
}));
```
- you can require a file by yourself. ( yep, proxy is a "god" function)
```js
const mock = rewiremock.proxy(() => require('somemodule'), {
   'dep1': { name: 'override' },
   'dep2': { onlyDump: 'stubs' }  
}));
```
- or use es6 `import` (not for node.js mjs `real` es6 modules) 
`module` is an async version of proxy, so you can use imports
```js
const mock = await rewiremock.module(() => import('somemodule'), {
   'dep1': { name: 'override' },
   'dep2': { onlyDump: 'stubs' }  
}));
```
- `around` - another version of .module, where you can do just ~anything~.
```js
const mock = await rewiremock.around(() => import('somemodule'), () => {
   rewiremock('dep1').with('something');  
   callMom();
   // prepare mocking behavior
}));
```
- `enable`/`disable` - Low level API
```js  
  rewiremock('someThing').with('someThingElse')
  rewiremock.enable();
  // require something
  rewiremock.disable();
```

In all the cases you can specify what exactly you want to mock, or just mock anything 
```js
   addPlugin(plugins.mockThroughByDefault);  
```

# Hoisted mocking 
You can also use a top level mocking, the same as Jest could only provide
```js
import sinon from 'sinon';
import rewiremock from 'rewiremock';
import Component1 from 'common/Component1';
import selectors from 'common/selectors';

rewiremock('common/Component1').by('common/Component2');
rewiremock('common/Component2/action').with({ action: () => {} });
rewiremock('common/selectors').mockThrough(() => sinon.stub());

selectors.findUser.returns("cat"); // this is sinon stub.
``` 
As result Component1 will be replaced by Component2, action with empty function and 
all selectors by sinon stubs, with one configured.

This is only possible via babel plugin, and without it this code will be executed without any sence, as long mocking
will be configured after the files required.

1. Add `rewiremock/babel' into plugin section in `.babelrc`
2. This example will be transpiled into
```jsjs
import sinon from 'sinon';
import rewiremock from 'rewiremock';

rewiremock('common/Component1').by('common/Component2');
rewiremock('common/Component2/action').with({ action: () => {} });
rewiremock('common/selectors').mockThrough(() => sinon.stub());

rewiremock.enabled();

import Component1 from 'common/Component1';
import selectors from 'common/selectors';

rewiremock.disable();

selectors.findUser.returns("cat"); // this is sinon stub.
``` 

Keep in mind - rewiremock will hoist mock definition next to rewiremock import.
 - You can use anything above rewiremock import
 - You can mock anything below rewiremock import
 
### Changing the mocks after the mocking
It is possible to partially change mocking already being applied.
```js
 rewiremock('./foo')
  .callThrough()
  .with({ action1: action1Stub1 })
  .dynamic();

 const foo = require('./foo');
 foo.action == action1Stub1;
 
 rewiremock.getMock('./foo')
   .with({ action1: action1Stub2 });
 
 //while will RESET the mock, and could not change existing ones.
 rewiremock('./foo')
    .with({ action1: action1Stub2 });
 
 foo.action == action1Stub2;
 
 rewiremock('./foo')
    .with({ });
 
 foo.action == theRealFoo;
```   

#### Changing the hoisted mocks
```js
 import rewiremock from 'rewiremock';
 import foo from './foo';
 
 rewiremock('./foo') 
   .with({ action1: action1Stub1 })
   .dynamic();

 const fooMock = rewiremock.getMock('./foo');
 
 describe(..., () => {
   it('...', () => {
     fooMock.with({ });
     
     // while may NOT found the mock
     rewiremock.getMock('./foo').with({ });
   });
 })
```

# Type safety
Rewiremock is able to provide a type-safe mocks. To enable type-safety follow these steps:
1. Use TypeScript or Flow.
2. Use dynamic import syntax.
3. Use rewiremock.around or rewiremock.module to perform a mock.
4. Use async form of rewiremock mock declaration.

```js
// @flow

import rewiremock  from 'rewiremock';

rewiremock.around(
  () => import('./a.js'), 
  mock => {
  mock(() => import('./b.js'))
    .withDefault(() => "4")
    .with({testB: () => 10})
    .nonStrict() // turn off type system
    .with({ absolutely: "anything" })
  }
);
```
If default export is not exists on module 'b', or there is no named export testB, or types do not match - type system will throw.

If you will declare an async mock, you it will not be resolved by the time of execution - Rewiremock will throw on Error.

If you have async imports inside mocked file, follow this syntax
```js
rewiremock.around(
  () => import('./a.js'), 
  mock => {
  // just before loader function rewiremock enabled itself
  mock(() => import('./b.js').then(mock=>mock)) // mocks `live` one `tick` more
  // just after loader function resolved rewiremock disables itself
    mock => {
    ....
    }
  }
);
```

# Type safety for JavaScript
Rewiremock can check mock against the real implementation. This does not perform `type checking`, but
could check exported names and exported types (function vs number, for example).

Rewiremock expects that mock will be __less or equal__ than original file.
```text
rewiremock: mocked export "somethingMissing" does not exists in ./b.js
rewiremock: exported type mismatch: ./b.js:default. Expected function, got number
```
To activate exports comparison
```js
 rewiremock('somemoduname')
   .toMatchOrigin(); // to activate
   
// or
import rewiremock, { addPlugin, removePlugin, plugins } from 'rewiremock';
addPlugin(plugins.alwaysMatchOrigin);   
```
 
# Setup

## To run with node.js
  Just use it. You can also activate nodejs, which will double check all modules names on a real FS, but..
  everything might work out of the box.
  > PS: Just use usedByDefault to ensure module names are resolved correctly.
  
  There is also a special entry point for node.js, with nodejs plugin activated, and rewiremock as es5 export
   ```js
   const rewiremock = require('rewiremock/node');
   
   // meanwhile
   const rewiremock = require('rewiremock').default;
   ```

## To run inside webpack enviroment.
  Rewiremock can `emulate` few webpack features(like aliases) in node.js environment, but it also can be run inside webpack.
  > Actually rewiremock is the first client side mocking library
  
  But not so fast, hanny. First you have to have 3(!) Plugins enabled.
  1. webpack.NamedModulesPlugin(). To enlight the real names of modules. Not "numbers".
  2. webpack.HotModuleReplacementPlugin(). To provide some information about connections between modules.
  3. rewiremock.webpackPlugin. To add some magic and make gears rolling.
  
```js
plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new (require("rewiremock/webpack/plugin"))()
]
```
  That's all. Now all magic will happens at client side.
  > It is better to use .proxy/module command with direct require/import and leave all names conversion to webpack.

### webpack troubleshooting
Currently there are 2 known problems, both for mocha+webpack, ie using nodejs to run webpack bundle:
- TypeError: Cannot read property 'webpackHotUpdate' of undefined

  Caused by babel. Just dont use babel then running webpack bundles. Use babel them creating bundled.
- TypeError: Cannot read property 'call' of undefined 

  Caused by webpack. Sometimes is does not include some important files.
  To solve this problem just `import('rewiremock/webpack/interceptor')` in scaffolding.
  The problem is simply - this file does not exists in the bundle.  

   
## To actually... mock   

First - define your mocks. You can do it in any place, this is just a setup.
```javascript
 import rewiremock from 'rewiremock';
 ...
 
 // totaly mock `fs` with your stub 
 rewiremock('fs')
    .with({
        readFile: yourFunction
    });
  
 // replace path, by other module 
 rewiremock('path')
    .by('path-mock');
 
 // replace enzyme by preconfigured one  (from https://medium.com/airbnb-engineering/unlocking-test-performance-migrating-from-mocha-to-jest-2796c508ec50)
  rewiremock('enzyme')
     .by(({requireActual}) => {
    // see rest of possible params in d.ts file
         const enzyme = requireActual('enzyme');         
         if (!mockSetup) {
           const chai = requireActual('chai');
           const chaiEnzyme = requireActual('chai-enzyme');
           chai.use(chaiEnzyme());           
         }
         return enzyme;
     });
  
 // replace default export of ES6 module 
 rewiremock('reactComponent')
    .withDefault(MockedComponent)
     
 // replace only part of some library and keep the rest 
 rewiremock('someLibrary')
    .callThrough() 
    .with({
        onlyOneMethod
    })
    
 // secure yourself and from 'unexpected' mocks
 rewiremock('myDep')
     .with(mockedDep) 
     .calledFromMock()
```   
   
# Running
 There is a simply way to do it: Just enable it, and dont forget to disable it later.
 ```javascript
  //in mocha tests
  beforeEach( () => rewiremock.enable() );
  //...
  // here you will get some advantage in type casting and autocompleting.
  // it will actually works...
  const someModule = require('someModule'); 
  //...
  afterEach( () => rewiremock.disable() );
 ```
 Once enabled, rewiremock will wipe all mocked modules from cache, and all modules which require them.
 
 Including your test.
 
 Once disabled it will restore everything. 
 
 All unrelated to test dependencies will be kept. Node modules, react, common files - everything.
 
 As result - it will run faster.
  
# inScope
 Sometimes you will have independent tests in a single file, and you might need separate mocks for each one.
 `inScope` execute callback inside sandbox, and all mocks or plugins or anything else you have added will not leaks away.
 ```javascript
  rewiremock.inScope( () => {
    rewiremock('something').with(something);
    rewiremock.enable();
    // is 'something' mocked? Yes
    ....
    rewiremock.disable();
    // is 'something' mocked? No
    // is it still listed as mock? Yes
  }); 
  // is 'something' mocked or listed? No
 ```

# Around
 And there is a bit harder way to do it - scope.
 inScope will create new internal scope, next you can add something new to it, and then it will be destroyed.
 It will also enable/disable rewiremock just in time.
 
 This helps keep tests in isolation.
 
 PS: scopes are nesting each other like javascript prototypes do.
```javascript
rewiremock.around(
    () => import('somemodule'), // load a module. Using import or require.
    // just before it you can specify mocks or anything else
    (mock) => { 
        addPlugin(nodePlugin);

        mock('./lib/a/foo').with(() => 'aa');
        mock('./lib/a/../b/bar').with(() => 'bb');
        mock('./lib/a/../b/baz').with(() => 'cc');
    }
) // at this point scope is dead
    .then((mockedBaz) => { 
        expect(mockedBaz()).to.be.equal('aabbcc');
    });
```  
or just 
```javascript
rewiremock.around(() => import('somemodule')).then(mockedModule => doSomething)  
```
or
```javascript
rewiremock.around(
    () => import('somemodule').then( mockedModule => doSomething),    
    (mock) => aPromise   
);

```
Currently .inScope is the only API capable to handle es6(not node [m]js!) dynamic imports.

# Proxy
 Sometimes it is much easier to combine all the things together.
```js
// preferred way - crete stubs using a function, where R is mock creator
rewiremock.proxy('somemodule', (r) => ({
   'dep1': { name: 'override' },
   'dep2': r.with({name: 'override' }).toBeUsed().directChildOnly() // same powerfull syntax
}));

// straight way - just provide stubs.
rewiremock.proxy('somemodule', {
   'dep1': { name: 'override' },
   'dep2': { name: 'override' }
 }));
```


# Plugins
 By default - rewiremock has limited features. You can extend its behavior via plugins.
 - relative. A bit simply, proxyquire-like behavior. Will override only first level deps, and will wipe a lot of modules from a cache.
 - nodejs. Common support to `usual` node.js application. Will absolutize all paths. Will wipe cache very accurately. 
 - webpack-alias. Enabled you to use webpack aliases as module names.
 - childOnly. Only first level dependencies will be mocked. 
 - protectNodeModules. Ensures that any module from node_modules will not be wiped from a cache.
 - toBeUsed. Adds feature. The only plugin enabled by default.
 - disabledByDefault. All mocks will be disabled on create and at the end of each cycle.
 - mockThroughByDefault. All mocks mocked through.
 - usedByDefault. All mocks to be used by fact (reverse isolation)  
 ```javascript
 import rewiremock, { addPlugin, removePlugin, plugins } from 'rewiremock';     
 
 addPlugin(plugins.webpackAlias);
 removePlugin(plugins.webpackAlias);
 ``` 

# Nested declarations
 If you import rewiremock from other place, for example to add some defaults mocks - it will not gonna work.
 Each instance of rewiremock in independent.
 You have to pass your instance of rewiremock to build a library.
 PS: note, rewiremock did have nested API, but it were removed.
  
# Isolation
 Unit testing requires all dependencies to be mocked. All!
 To enable it, run
 ```javascript
  rewiremock.isolation();
  //or
  rewiremock.withoutIsolation();
 ```
 Then active - rewiremock will throw error on require of any unknown module.
 
 Unknown is module which is nor mocked, nor marked as pass-through. 
 
 To make few modules to be `invisible` to rewiremock, run
 ```javascript
 rewiremock.passBy(/*pattern or function*/);
 
 rewiremock.passBy(/common/);
 rewiremock.passBy(/React/);
 rewiremock.passBy(/node_modules/);
 rewiremock.passBy((name) => name.indexOf('.node')>=0 )
 ```
 
 
 # Reverse isolation
  Sometimes you have to be sure, that you mock is actually was called.
  Isolation will protect you then you add new dependencies, `.toBeUsed` protect you from removal.
 
 # Jest
 Jest is a very popular testing framework, but it has one issue - is already contain mocking support.
 
 > Do not use rewiremock and jest. Even if it is possible.
 
 ## Jest will not allow ANY other mocking library to coexists with Jest
 To use rewiremock with Jest add to the beginning of your file
 ```js
 // better to disable automock
 jest.disableAutomock();

 // Jest breaks the rules, and you have to restore nesting of a modules.
 rewiremock.overrideEntryPoint(module);
 
 // There is no way to use overload by Jest require or requireActual.
 // use the version provided by rewiremock. 
 require = rewiremock.requireActual;
 ```
 
 !!! the last line here may disable Jest sandboxing. !!! 
 
 Also it will disable Jest transformation, killing all the jest magics.
 
 To be able continue use ES6/imports - you have to enforce Babel to be applied in the `common` way.
 ```js
 describe('block of tests', () => {
   // require babel-register in describe or it block.
   // NOT! On top level. Jest sandboxing and isolation are still in action,
   // and will reset all settings to default
   require("babel-register");
 })
```
 PS: Jest will set BABEL_ENV to `test`.
 
 It is better just to use `rewiremock.requireActual`, without overriding global require.
  
 
 
 # Your own setup.
  In most cases you have to:
   - add plugin
   - setup default passBy rules
   - add some common mocks
   - do something else.
   
   And it is not a good idea to do it in every test you have.
   
   It is better to have one setup file, which will do everything for you
   * Part 1 - man in the middle
```javascript
  // this is your test file
  
  // instead of importing original file - import your own one
  // import rewiremock from 'rewiremock';
  import rewiremock from 'test/rewiremock';    
```
  
  * Part 2 - create your own one
    
```javascript
    // this tests/rewiremock.js
    
    import rewiremock, { addPlugin, overrideEntryPoint} from 'rewiremock';
    // do anything you need
    addPlugin(something);
    rewiremock('somemodule').with(/*....*/);   
    
    // but don't forget to add some magic
    overrideEntryPoint(module); // <-- set yourself as top module
    // PS: rewiremock will wipe this module from cache to keep magic alive.
       
    export default rewiremock;
``` 
 * Part 3 - enjoy.
 You extract some common code into helper. And things become a lot easier.
 
 # Default configuration
 Absolutely the same - preconfiguring rewiremock one can achive via default configuration.
 
 Just put __rewiremock.config.js__ in the root dir, next to project.json, and export a configuration function
```js
// rewiremock.config.js
import wrongrewiremock, {plugins} from 'rewiremock';

export default rewiremock => {
  // do everything with "right" rewiremock
  rewiremock.addPlugin(plugins.nodejs)
}
```
   
 # Caching

Default cache policy follow these steps:

1. Preparation:

- all files required from original test, while interceptor is active, will bypass cache.
- all files you indicate as mocks will be removed from the cache.
- all "soiled" files which rely on mocks - will also  be removed from the cache.
- repeat .

2. Finalization
- repeat all mocks, and possible "soiled" by mocks files.
- copy over the old cache.
- or restore the old cache complitely if `forceCacheClear` mode is set.

The last variant is default for proxyquire and mockery, also it is more `sequre` from different side effects.
Regardless, default is the first variant - as a way faster, and secure enough. 

As result of this mocking strategy you can mock any file at any level, while keeping another files cached.

#### Hint  
If you __don't want__  this - just add `relative` plugin. It will allow mocking only for modules

>  _required from __module__ with __parent__ equals __entryPoint__._

  PS: module with parent equals entryPoint - any module you require from test(it is an entry point).
  required from that module - first level require. Simple.
  
  
 # Own plugins
Don't forget - you can write your own plugins. 
 plugin is an object with fields:
 ```javascript
 {
 // to transform name. Used by alias or node.js module
 fileNameTransformer: (fileName, parentModule) => fileName;
 // check should you wipe module or not. Never used :)
 wipeCheck: (stubs, moduleName) => boolean,
 // check is mocking allowed for a module. User in relative plugin
 shouldMock: (mock, requestFilename, parentModule, entryPoint) => boolean
 }
 ```
# Not working?
 If something is not working - just check that you:
  - added a plugin to transform names (nodejs, webpackAlias or relative)
  - use .toBeUsed for each mocks
And they actually were mocked. If not - rewiremock will throw an Error.
  

# Wanna read something about?
 [Rewiremock - medium article](https://medium.com/@antonkorzunov/how-to-mock-dependency-in-a-node-js-and-why-2ad4386f6587)
 
# Licence
 MIT
 
 

Happy mocking!
