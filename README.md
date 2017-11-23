# rewiremock [![Build Status](https://secure.travis-ci.org/theKashey/rewiremock.svg)](http://travis-ci.org/theKashey/rewiremock)

[![NPM](https://nodei.co/npm/rewiremock.png?downloads=true&stars=true)](https://nodei.co/npm/rewiremock/)

Simple es6-friendly mocking library inspired by the best libraries:
- [mockery](https://github.com/mfncooper/mockery) - the library I like the most.
- [mock-require](https://github.com/boblauer/mock-require) - the simplest thing ever.
- [proxyquire](https://github.com/theKashey/proxyquire) - the one I know better than others.

By its nature rewiremock has same behavior as Mockery. But it can behave like others too.
It covers _any_ cases. It is the right way to mock your dependencies or perform dependency injection.
 

Rewiremock is an evolution of lessons I learned from: 
the better [proxyquire](https://github.com/theKashey/proxyquire), 
the way of [resolveQuire](https://github.com/theKashey/resolveQuire),
and magic of [proxyquire-webpack-alias](https://github.com/theKashey/proxyquire-webpack-alias).

# Ideology
- be right, and enable `true` testing experience.
- be simple, and ease to use.
- be modular, to cover all cases.
- be secure, and isolate target under test.
- be fast, to be faster.

# Goal:
- give ability to mock everything - CommonJS, ES6, Webpack, anything.
- give ability to do correctly - isolation, typechecks, powerfull API

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
    - .by(otherModule: string| function) - overload by another module(if string provider) or by result of a function call. 
    - .callThrough() - first load original module, and next extend it by provided stub.    
    - .toBeUsed() - enables usage checking.  
    - .directChildOnly - will do mock only direct dependencies.
    - .calledFromMock - will do mock only dependencies of mocked dependencies.
 ## isolation API
 - rewiremock.isolation() - enables isolation
 - rewiremock.withoutIsolation() - disables isolation
 - rewiremock.passBy(pattern or function) - enables some modules to pass thought isolation.
 ## sandboxing
 - rewiremock.inScope(callback) - place synchronous callback inside a sandbox.

# Which one?
Yep - there is 4 top level ways to activate a mock - inScope, around, proxy or just enable.

Which one to choose? Any! It just depends:
  - If everything is simply - use __rewiremock.proxy__.
  - If you have issues with name resolve - use __rewiremock.module__ and resolve names by yourself.
  - If you need scope isolation - use __rewiremock.around__, or inScope.
  - If you advanced syntax and type checking - use __rewiremock.around__.
  - If you need full control - you will always have it.
  - You always can just use __.enable/.disable__.  

#Usage
```js
// 1. proxy will load a file by it's own ( keep in mind - name resolution is a complex thing)
const mock = rewiremock.proxy('somemodule', (r) => ({
   'dep1': { name: 'override' },
   'dep2': r.with({name: 'override' }).toBeUsed().directChildOnly() // use all `mocking API`  
}));

// 2. you can require a file by yourself. ( yep, proxy is a god function)
const mock = rewiremock.proxy(() => require('somemodule'), {
   'dep1': { name: 'override' },
   'dep2': { onlyDump: 'stubs' }  
}));

// 3. or use es6 import (not for node.js mjs `real` es6 modules) 
// PS: module is an async version of proxy, so you can use imports
const mock = await rewiremock.module(() => import('somemodule'), {
   'dep1': { name: 'override' },
   'dep2': { onlyDump: 'stubs' }  
}));

// 3. another version of .module, where you can do just ~anything~.
const mock = await rewiremock.around(() => import('somemodule'), () => {
   rewiremock('dep1').with('something');  
   callMom();
}));

// 4. Low level API
  rewiremock('someThing').with('someThingElse')
  rewiremock.enable();
  rewiremock.disable();
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
 

# Setup

## To run with node.js
  Just use it. You can also activate nodejs, which will double check all modules names on a real FS, but..
  everything might work out of the box.
  > PS: Just use usedByDefault to ensure module names are resolved correctly.

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
 Unit testing requires all decencies to be mocked. All!
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
 
 # Reverse isolation.
  Sometimes you have to be sure, that you mock is actually was called.
  Isolation will protect you then you add new dependencies, `.toBeUsed` protect you from removal.
 
 # Jest
 Jest is a very popular testing framework, but it has one issue - is already contain mocking support.
 
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
   
 # Caching
 
Other libraries will always do strange things with cache:

- just wipe everything. Absolutely. 
As a result tests will run slow, or not run at all. 
Normally you should not wipe native(.node) modules, and external(node_modules) modules.
 For example you should not wipe React - _new_ version of React will be incompatible with old one.
- wipe only listed modules. Exactly.
 Also not a good idea, as sometimes you can found some sort of middleware between first and mocked module.
 Syntax sugar, third party library, helper, and so on.

Rewiremock is using a bit different, smarter way:

- all files required from original test, while interceptor is active, will bypass cache.
 (proxyquire can't do it, as it works at a lower API level).
- all files you indicate as mocks will be removed from cache. Unfortunately all, in any case.
- all files which rely on mocks - will also  be removed from cache.
- repeat.
  
As a result - it will not wipe things it should not wipe.

As a result - you can mock any file at any level. Sometimes it is useful.
  
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
