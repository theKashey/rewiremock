# mock-module [![Build Status](https://secure.travis-ci.org/thekashey/mock-module.svg)](http://travis-ci.org/thekashey/mock-module)

[![NPM](https://nodei.co/npm/mock-module.png?downloads=true&stars=true)](https://nodei.co/npm/mock-module/)

Simple es6-friendly mocking library inspired by the best libraries:
- [mockery](https://github.com/mfncooper/mockery) - the library I like more.
- [mock-require](https://github.com/boblauer/mock-require) - the simplest thing ever.
- [proxyquire](https://github.com/theKashey/proxyquire) - the one I know better than others.

By its nature mockModule has same behavior as Mockery. But it can have any behavior.
It covers _any_ cases.

# Idealogy
- be simply
- be modular
- be secure
- be fast

# Setup

First - define your mocks. You can do it in any place, this is just a setup.
```javascript
 import mockModule from 'mockmodule';
 ...
 
 // totaly mock `fs` with your stub 
 mockModule('fs')
    .with({
        readFile: yourFunction
    });
  
 // replace path, by other module 
 mockModule('path')
    .by('path-mock');
  
 // replace default export of ES6 module 
 mockModule('reactComponent')
    .withDefault(MockedComponent)
 
 // replace only part of some library and keep the rest 
 mockModule('someLibrary')
    .callThought() 
    .with({
        onlyOneMethod
    })
```   
   
# Running
 Just enabled, and dont forget to disable.
 ```javascript
  //in mocha tests
  beforeEach( () => mockModule.enable() );
  //...
  const someModule = require('someModule');
  //...
  afterEach( () => mockModule.disable() );
 ```
 On enable mockModule will wipe from cache all mocked modules, and all modules which requares them.
 
 Including your test.
 
 On disable it will repeat operation. 
 
 All test unrelated modules will be keept. Node modules, react, common files - everything.
 
 As result - it will run faster.

# Plugins
 By default - mock-module has limited features. You can extend it behavior by using plugins.
 - nodejs. Common support to `usual` node.js application. Will absolutize all paths.
 - relative. Proxyquire-like behavior. Will overide only first level deps.
 - webpack-alias. Enabled you to use webpack aliases as module names.  

# Nested declarations
 Each time you require mock-module - you will get brand new mock-module.
 
 You cannot declare `mocks library` - it will erase itself.
 
 But solution exists, and it is simply - 
 ```javascript
 // require mockModule in test file
  import mockModule from 'mock-module';
  
 // require nested one in library file
  import mockModule from 'mock-module/nested';
 // now you can defile dictionary or library of mocks 
 ```
 See _test/nested.spec.js.
  
# Isolation
 Unit testing requires all decencies to be mocked. All!
 To enable it, run
 ```javascript
  mockModule.isolation();
  //or
  mockModule.withoutIsolation();
 ```
 Then active - mockModule will throw error on require of any unknown module.
 
 Unknown is module which is nor mocked, nor marked as passthrough. 
 
 To enable few modules to in `invisible` to mockModule run
 ```javascript
 mockModule.passBy(/*pattern or function*/);
 
 mockModule.passBy(/common/);
 mockModule.passBy(/React/);
 mockModule.passBy(/node_modules/);
 mockModule.passBy((name) => name.indexOf('.node')>=0 )
 ```
 
 Thats all. Happy mocking!
 