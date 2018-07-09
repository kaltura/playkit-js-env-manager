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

### 2. Clone _kaltura-player-js_ repository
```
$ git clone https://github.com/kaltura/kaltura-player-js.git
$ cd kaltura-player-js
$ yarn
```

### 3. Folder structure
Pay attention that all playkit-js-* repos including kaltura-player-js repo must be under the same parent directory.
An example for a valid folder structure is:
```
- repos
  - playkit-js
  - playkit-js-hls
  - playkit-js-dash
  - playkit-js-ima
  - playkit-js-ui
  - playkit-js-youbora
  - playkit-js-providers
  - playkit-js-kanalytics
  - kaltura-player-js
```
# Quick Start
* Go to _package.json_ file in _kaltura-player-js_ project.
* Observe under `scripts` the following commands:
````
"scripts": {
  ....
  "playkit-dev:start": "playkit-dev start",
  "playkit-dev:stop": "playkit-dev stop",
  "playkit-rel": "playkit-rel start"
  ...
}
````
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Those commands will helps us to run the required modes.
* Observe new entry named `envManager` which contains the following configuration:

```
  "envManager": {
    "devMode": {},
    "releaseMode": []
  }
```
* To run a certain script, simply open your terminal, go to kaltura-player-js project:
```
$ cd PATH/TO/kaltura-player-js
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;and run one of:
  ```
  yarn run playkit-rel
  yarn run playkit-dev:start
  yarn run playkit-dev:stop
  ```
## Aliases for playkit repos
Each repo has an alias to shorten its name and thus manipulate the configuration more easily and quickly:
* _playkit-js -> **core**_
* _playkit-js-ui -> **ui**_
* _playkit-js-ima -> **ima**_
* _playkit-js-hls -> **hls**_
* _playkit-js-dash -> **dash**_
* _playkit-js-providers -> **providers**_
* _playkit-js-youbora -> **youbora**_
* _playkit-js-kanalytics -> **kanalytics**_
* _playkit-js-ott-analytics -> **ott-analytics**_
* _playkit-js-google-analytics -> **google-analytics**_
* _playkit-js-comscore -> **comscore**_
* _playkit-js-kava -> **kava**_
* _playkit-js-vr -> **vr**_

# Configuration

## devMode

### Commands
* **playkit-dev:start**
* **playkit-dev:stop**


### Structure
```
  "devMode": {
    "alias": "version",
    ...
  }
```

|     Property         	| Type    	| Possible Values| Description                                                                                                                                                                                	|
|----------------------	|---------	|-------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| ```version```         | ```string```|  ```'latest'```,```'local'```,```'vX.X.X'```   |Specifies the package version that the corresponding repo will checkout to on the local machine. For 'latest' it will checkout to the master branch. For 'local' it will stay on the current local branch (whatever that is).                                                                                                                                         	|


### Example:
```
  "devMode": {
    "core": "v0.10.0",
    "ui": "latest",
    "hls": "local"
  }
```

## releaseMode

### Commands
* **playkit-rel**

### Structure
```
  "releaseMode": [
    "alias1",
    "alias2",
    "alias3",
    ...
  ]
 ```
### Example:
```
  "releaseMode": [
    "core",
    "youbora",
    "hls",
    ...
  ]
 ```

## Compatibility

This tool has been tested only on Mac OS.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-ima/tags).

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
