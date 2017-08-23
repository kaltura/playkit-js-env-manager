# PlayKit JS Env Manager - An environment manager to setup playkit-js-* projects across repos

PlayKit JS Env Manager is a command line tool which aims to solve the development 
challenges for multiple packages (playkit-js-*) that 
integrates to a single application ([Kaltura Player] in our case).

[Kaltura Player]: https://github.com/kaltura/kaltura-player-js

# Prerequisites

### 1. Install ttab 
First, install ttab globally on your machine: 
```
$ [sudo] npm install ttab -g
```
Then, go to System Preferences > Security & Privacy, tab Privacy, 
select Accessibility, unlock, and make sure Terminal.app is in the list on the 
right and has a checkmark.

### 2. Clone and install dependencies
```
$ git clone https://github.com/kaltura/playkit-js-env-manager.git
$ cd playkit-js-env-manager
$ npm install
```
### 3. Link project
```
$ npm link
```

### 4. Folder structure
//TODO

This will install the package scripts globally on your machine.
# Commands
Start dev mode:
```
$ devStart
```
Stop dev mode:
```
$ devStop
```
Those commands will look at the ```devMode``` section of each repo configuration under ``` playkit-repos.json ```
and will start/stop dev mode according to the configured values there.
# Configuration
The default configuration define as:
```
{
  "playkit-js": {
    "devMode": {
      "version": "latest",
      "link": true,
      "watch": true
    },
    "releaseMode": {}
  },
  "playkit-js-hls": {
    "devMode": {
      "version": "latest",
      "link": true,
      "watch": false
    },
    "releaseMode": {}
  },
  "playkit-js-dash": {
    "devMode": {
      "version": "latest",
      "link": true,
      "watch": false
    },
    "releaseMode": {}
  },
  "playkit-js-ima": {
    "devMode": {
      "version": "latest",
      "link": false,
      "watch": false
    },
    "releaseMode": {}
  },
  "playkit-js-kanalytics": {
    "devMode": {
      "version": "latest",
      "link": false,
      "watch": false
    },
    "releaseMode": {}
  },
  "playkit-js-ui": {
    "devMode": {
      "version": "latest",
      "link": false,
      "watch": false
    },
    "releaseMode": {}
  },
  "playkit-js-providers": {
    "devMode": {
      "version": "latest",
      "link": false,
      "watch": false
    },
    "releaseMode": {}
  }
}
```

## Properties
### ``` devMode ```
#### related commands: ``` devStart```, ``` devStop```

|     Property         	| Type    	| Possible Values| Description                                                                                                                                                                                	|
|----------------------	|---------	|-------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| ```version```         | ```string```|  ```'latest'```,```'local'```,```'vX.X.X'```   |Specifies the package version that the corresponding repo will checkout to on the local machine. For 'latest' it will checkout to the master branch. **Relevant only if ```link``` is set to true. Otherwise, the repo version define in the package.json of kaltura-player-js will be loaded.**                                                                                                                                        	|
| ``` link```           | ```boolean```|  ```true```,```false```	|Specifies whether this package should be linked, i.e, whether to pull the package bundle from the local machine or not. If set to false, the bundle will be taken from node_modules folder of kaltura-player-js.                                                                                                                                 	|
| ```watch```          	| ```boolean```|  ```true```,```false``` 	|Specifies whether to watch the repo or not, i.e, whether to start webpack dev server to recompile the bundle in case of live code changes. **Relevant only if ```link``` is set to true.**|

## Compatibility

This tool has been tested only on Mac OS.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-ima/tags). 

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
