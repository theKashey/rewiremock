# rewiremock [![Build Status](https://secure.travis-ci.org/theKashey/rewiremock.svg)](http://travis-ci.org/theKashey/rewiremock)

[![NPM](https://nodei.co/npm/rewiremock.png?downloads=true&stars=true)](https://nodei.co/npm/rewiremock/)

Simple es6-friendly mocking library inspired by the best libraries:
- [mockery](https://github.com/mfncooper/mockery) - the library I like the most.
- [mock-require](https://github.com/boblauer/mock-require) - the simplest thing ever.
- [proxyquire](https://github.com/theKashey/proxyquire) - the one I know better than others.

By its nature rewiremock has same behavior as Mockery. But it can behave like others too.
It covers _any_ cases.

Rewiremock is an evolution of lessons I learned from: 
the better [proxyquire](https://github.com/theKashey/proxyquire), 
the way of [resolveQuire](https://github.com/theKashey/resolveQuire),
and magic of [proxyquire-webpack-alias](https://github.com/theKashey/proxyquire-webpack-alias).

Rewiremock was initially named as mockImports or mockModule. But was renamed to RewireMock.

We shall not use that name, but [rewire](https://github.com/jhnns/rewire) - is one of existing mocking libraries.


# Ideology
- be simple
- be modular
- be secure
- be fast

# API
 see d.ts file, or JSDoc in javascript sources.
 
 ## main API
 - rewiremock.enable() - wipes cache and enables interceptor.
 - rewiremock.disable() - wipes cache and disables interceptor.
 - rewiremock.inScope(callback) - place callback inside a sandbox.
 - rewiremock.around(loader, creator) - loads a module in an asynchronous sandbox.
 ## mocking API 
 - rewiremock(moduleName: string):rewiremock - set name of overloading module
    - .with(stubs: function | Object) - overloads current module
    - .withDefault(stub: function | Object) - overload `default` es6 export
    - .by(otherModule: string) - overload everything by another module
    - .callThought() - first load original module, and next extend it by provided stub.
    - .enable/disable() - to enable or disable mock (enabled by default).
    - .toBeUsed() - enables usage checking  
 ## isolation API
 - rewiremock.isolation() - enables isolation
 - rewiremock.withoutIsolation() - disables isolation
 - rewiremock.passBy(pattern or function) - enables some modules to pass thought isolation.

# Not working?
 If something is not working - just check that you:
  - added a plugin to transform names (nodejs, webpackAlias or relative)
  - use .toBeUsed for each mocks
And they actually were mocked. If not - rewiremock will throw an Error.

# Setup

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
  
 // replace default export of ES6 module 
 rewiremock('reactComponent')
    .withDefault(MockedComponent)
 
 // replace only part of some library and keep the rest 
 rewiremock('someLibrary')
    .callThought() 
    .with({
        onlyOneMethod
    })
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
    ....
    rewiremock.disable();
    // is 'something' mocked? Yes
  }); 
  // is 'something' mocked? No
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
Currently .inScope is the only API capable to handle es6 dynamic imports.

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
 
# Licence
 MIT
 
 

Happy mocking!
