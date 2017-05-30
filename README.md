# rewiremock [![Build Status](https://secure.travis-ci.org/theKashey/rewiremock.svg)](http://travis-ci.org/theKashey/rewiremock)

[![NPM](https://nodei.co/npm/rewiremock.png?downloads=true&stars=true)](https://nodei.co/npm/rewiremock/)

Rewiremock was initially named as mockImports or mockModule. But was renamed for WireMock.
 
We shall not use that name, but [rewire](https://github.com/jhnns/rewire) - is one of existing micking library.
We are rewrite mock...

Simple es6-friendly mocking library inspired by the best libraries:
- [mockery](https://github.com/mfncooper/mockery) - the library I like more.
- [mock-require](https://github.com/boblauer/mock-require) - the simplest thing ever.
- [proxyquire](https://github.com/theKashey/proxyquire) - the one I know better than others.

By its nature rewiremock has same behavior as Mockery. But it can have any behavior.
It covers _any_ cases.

# Idealogy
- be simply
- be modular
- be secure
- be fast

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
 Just enabled, and dont forget to disable.
 ```javascript
  //in mocha tests
  beforeEach( () => rewiremock.enable() );
  //...
  const someModule = require('someModule');
  //...
  afterEach( () => rewiremock.disable() );
 ```
 On enable rewiremock will wipe from cache all mocked modules, and all modules which requares them.
 
 Including your test.
 
 On disable it will repeat operation. 
 
 All test unrelated modules will be keept. Node modules, react, common files - everything.
 
 As result - it will run faster.

# Plugins
 By default - rewiremock has limited features. You can extend it behavior by using plugins.
 - nodejs. Common support to `usual` node.js application. Will absolutize all paths.
 - relative. Proxyquire-like behavior. Will overide only first level deps.
 - webpack-alias. Enabled you to use webpack aliases as module names.  

# Nested declarations
 Each time you require rewiremock - you will get brand new rewiremock.
 
 You cannot declare `mocks library` - it will erase itself.
 
 But solution exists, and it is simply - 
 ```javascript
 // require rewiremock in test file
  import rewiremock from 'rewiremock';
  
 // require nested one in library file
  import rewiremock from 'rewiremock/nested';
 // now you can defile dictionary or library of mocks 
 ```
 See _test/nested.spec.js.
  
# Isolation
 Unit testing requires all decencies to be mocked. All!
 To enable it, run
 ```javascript
  rewiremock.isolation();
  //or
  rewiremock.withoutIsolation();
 ```
 Then active - rewiremock will throw error on require of any unknown module.
 
 Unknown is module which is nor mocked, nor marked as passthrough. 
 
 To enable few modules to in `invisible` to rewiremock run
 ```javascript
 rewiremock.passBy(/*pattern or function*/);
 
 rewiremock.passBy(/common/);
 rewiremock.passBy(/React/);
 rewiremock.passBy(/node_modules/);
 rewiremock.passBy((name) => name.indexOf('.node')>=0 )
 ```
 
 Thats all. Happy mocking!
 