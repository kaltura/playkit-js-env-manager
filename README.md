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
This will install the package scripts globally on your machine.

### 4. Folder structure
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


# playkit-dev 

## Commands

### playkit-dev start <OPT_CONFIG_FILE_PATH.json>

##### Starts the dev mode.

Examples:
```
$ playkit-dev start 
```
Config file will be taken from playkit-js-env-manager/lib/playkit-repos.json
```
$ playkit-dev start /Users/MY_USER/config.json
```
Config file will be taken from /Users/MY_USER/config.json

### playkit-dev stop <OPT_CONFIG_FILE_PATH.json>

##### Stops the dev mode.

Examples:
```
$ playkit-dev stop 
```
Config file will be taken from playkit-js-env-manager/lib/playkit-repos.json
```
$ playkit-dev stop /Users/MY_USER/config.json
```
Config file will be taken from /Users/MY_USER/config.json


## Configuration

### Structure
```
"playkit-js-*" : {
  "devMode" : {
    "link" : boolean,
    "version" : string,
    "watch" : boolean
  }
}
```
The above commands will look at the ```devMode``` section of each repo configuration under ``` playkit-repos.json (or OPT_CONFIG_FILE_PATH.json if provided) ```
and will start/stop dev mode according to the configured values there.

### Properties

|     Property         	| Type    	| Possible Values| Description                                                                                                                                                                                	|
|----------------------	|---------	|-------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| ``` link```           | ```boolean```|  ```true```,```false```	|Specifies whether this package should be linked, i.e, whether to pull the package bundle from the local machine or not. If set to ``` false``` , the bundle will be taken from ``` node_modules```  folder of ``` kaltura-player-js``` repo.                                                                                                                                 	|
| ```version```         | ```string```|  ```'latest'```,```'local'```,```'vX.X.X'```   |Specifies the package version that the corresponding repo will checkout to on the local machine. For 'latest' it will checkout to the master branch. For 'local' it will stay on the current local branch (whatever that is). **Relevant only if ```link``` is set to true. Otherwise, the repo version defined in the ```package.json``` file of ```kaltura-player-js``` repo will be loaded.**                                                                                                                                        	|
| ```watch```          	| ```boolean```|  ```true```,```false``` 	|Specifies whether to watch the repo or not, i.e, whether to start webpack dev server to recompile the bundle in case of live code changes. **Relevant only if ```link``` is set to true.**|

# playkit-rel 

### playkit-rel start <OPT_CONFIG_FILE_PATH.json>

##### Starts the release mode.

Examples:
```
$ playkit-rel start 
```
Config file will be taken from playkit-js-env-manager/lib/playkit-repos.json
```
$ playkit-rel start /Users/MY_USER/config.json
```
Config file will be taken from /Users/MY_USER/config.json

## Configuration

### Structure
```
"playkit-js-*" : {
  "releaseMode" : {
    "skip" : boolean
  }
}
```
The above command will look at the ```releaseMode``` section of each repo configuration under ``` playkit-repos.json (or OPT_CONFIG_FILE_PATH.json if provided) ```
and will start release mode according to the configured values there.

### Properties

|     Property         	| Type    	| Possible Values| Description                                                                                                                                                                                	|
|----------------------	|---------	|-------	|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| ```skip```          	| ```boolean```|  ```true```,```false``` 	|Specifies whether to skip the repo while releasing a version. 

## Flows
**Dev mode start - flow:**
* for each playkit-js-* repo, do:
  * clean dist
  * unlink repo
  * if repo is configured as link, check version:
    * if latest:
      * do nothing
    * else:
      * stash changes
      * if latest:
        * checkout origin master
        * pull origin master
      * if version: 
        * check tags
        * checkout to the configured tag
    * build repo
    * link repo
    * if repo is configured as watch:
      * start dev server 
* for kaltura-player-js repo, do:
  * for each playkit-js-* repo:
    * if repo is configured as link:
      * link repo in kaltura-player-js
  * start dev server

**Dev mode stop - flow:**
* for each playkit-js-* repo, do:
  * if repo is configured as link:
    * clean dist
    * unlink repo
* for kaltura-player-js repo, do:
  * for each playkit-js-* repo in package.json dependencies:
    * if repo is configured as link:
      * unlink repo
      * add repo
  * build
  
## Compatibility

This tool has been tested only on Mac OS.

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/kaltura/playkit-js-ima/tags). 

## License

This project is licensed under the AGPL-3.0 License - see the [LICENSE.md](LICENSE.md) file for details
