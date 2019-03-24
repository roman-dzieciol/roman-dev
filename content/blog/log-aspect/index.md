---
title: Log all the things with Log Aspects
date: "2019-03-10T05:20:10.000Z"
description: "This will set most logging to maximum level. A sample app will result in about 50 lines of logs at level 1 and about 20000 lines at level 3."
tags: ['Xcode', 'xcodebuild', 'undocumented']
---

For when you really need to log all the things

## xcodebuild

```
xcodebuild -DVTDefaultLogLevel=3
```

This will set most logging to maximum level. A sample app will result in about 50 lines of logs at `DVTDefaultLogLevel=1` and about 20000 lines at `DVTDefaultLogLevel=3`.


## Xcode

```
/Applications/Xcode.app/Contents/MacOS/Xcode -DVTDefaultLogLevel 3
```

This can crash Xcode due to bugs in logging. Enabling individual log aspects should work though.

## Log Aspects

Logging can be controlled on a more fine grained level. 

Available aspects when running xcodebuild:

`gist:roman-dzieciol/f7e16be760867488adf17bb9ed768964?file=log-aspect-xcodebuild.txt`

To enable individual log level, add it to the commandline with `LogLevel` postfix:

```
/Applications/Xcode.app/Contents/MacOS/Xcode -DVTDefaultLogLevel 3
```

`gist:roman-dzieciol/f7e16be760867488adf17bb9ed768964?file=xcodebuildDebugLogLevel.log`


More aspects could be available in Xcode and at runtime if a framework is loaded dynamically.
