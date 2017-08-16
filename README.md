# PlayKit JS Env Manager - Command Line Helper Tool for Kaltura Player

PlayKit JS Env Manager is a command line tool which aims to solve the development 
challenge on local environment for multiple packages that 
integrates to a single application. 
In our case, the [Kaltura Player].

[Kaltura Player]: https://github.com/kaltura/kaltura-player-js

## Install ttab 
First, install ttab globally on your machine: 
```
$ [sudo] npm install ttab -g
```
Then, go to System Preferences > Security & Privacy, tab Privacy, 
select Accessibility, unlock, and make sure Terminal.app is in the list on the 
right and has a checkmark.

## Clone and install dependencies
```
$ git clone https://github.com/kaltura/playkit-js-env-manager.git
$ cd playkit-js-env-manager
$ npm install
```

## Link 
```
$ npm link
```

## Commands
Start debugging:
```
$ start
```
Stop debugging:
```
$ stop
```
Release version (WIP):
```
$ release
```

## Configuration
The default configuration can be found under ``` repos.json ```:
```
{
  "playkit-js": {
    "debug": {
      "version": "latest",
      "link": true,
      "watch": true
    },
    "release": {}
  },
  "playkit-js-hls": {
    "debug": {
      "version": "latest",
      "link": true,
      "watch": false
    },
    "release": {}
  },
  "playkit-js-dash": {
    "debug": {
      "version": "latest",
      "link": true,
      "watch": false
    },
    "release": {}
  },
  "playkit-js-ima": {
    "debug": {
      "version": "latest",
      "link": false,
      "watch": false
    },
    "release": {}
  },
  "playkit-js-kanalytics": {
    "debug": {
      "version": "latest",
      "link": false,
      "watch": false
    },
    "release": {}
  },
  "playkit-js-ui": {
    "debug": {
      "version": "latest",
      "link": false,
      "watch": false
    },
    "release": {}
  },
  "playkit-js-providers": {
    "debug": {
      "version": "latest",
      "link": false,
      "watch": false
    },
    "release": {}
  }
}
```
### ``` start ```
Since ``` start ``` command preparing the env to locally debug the Kaltura Player, the relevant section
 for that in each packagge is under ``` debug ``` .
### Properties
|              	| Type    	| Required                                       	| Description                                                                                                                                                                                	|
|----------------------	|---------	|------------------------------------------------	|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| ```version```            | ```string``` 	|                                                	| Specifies the package version that the corresponding repo will checkout to. For 'latest' it will checkout to the master branch.                                                                                                                                             	|
| ``` link```             	| ```boolean``` 	|  	| Specifies whether this package should be linked, i.e, whether to pull the package bundle from the local machine or not. If set to false, the bundle will be taken from node_modules folder.                                                                                                                                 	|
| ```watch```          	| ```boolean``` 	|   	| Specifies whether to watch the repo or not, i.e, whether to start webpack dev server to recompile the bundle in case of live code change.|

### ``` release ```
WIP

## Compatibility

This tool has been tested only on Mac OS.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-ima/tags). 

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details