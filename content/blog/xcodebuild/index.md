---
title: Hello Compiler - Build your own xcodebuild
date: "2019-03-08T05:20:10.000Z"
description: ""
---

# Lets build our own `xcodebuild`!

The `xcodebuild` is a most basic wrapper that forwards commandline arguments to Xcode frameworks.
 
We can write our own. It's simpler than you think!


## Why?

What if you could modify Xcode so it works just the way you want?

### Gain access to Xcode APIs

The Xcode is built from a lot of modular specialized frameworks. Use them in your app any way you want. 

* Modify project files programmaticaly
* Control compilation precisely
* Generate custom outputs efficiently
* Anything Xcode does, you can too, in your own way, in the language you love most

### Learn how Xcode works internally

Generate Objective-C pseudo-source-code and framework headers for all of Xcode.

### Debug `xcodebuild`

Run your custom `xcodebuild` from within Xcode to debug Apple's frameworks.

### Find undocumented features

If you're curious, you'll find tons of useful undocumented features in Xcode.

### Add new features

Modify the behavior of Xcode by subclassing and/or swizzling Apple's code.

### Remain always 100% compatible with Xcode

And best of all, unlike 3rd party frameworks, it always works because it is the same code that Xcode IDE uses.


# Reading the xcodebuild source code
Lets figure out how `xcodebuild` works internally.

## Find `xcodebuild` binary
To find the `xcodebuild` command that will be run in bash use the `which` command:

	$ which xcodebuild
	/usr/bin/xcodebuild

The `/usr/bin/xcodebuild` is a helper for when you have multiple versions of Xcode installed. It will launch the `xcodebuild` version you want, based on your choice set in Xcode Preferences or `xcode-select`. 

It is very similar to using the `xcrun` command. I will describe how they work internally in upcoming post.

Use the `xcrun` command to find the `xcodebuild` binary we want:

	xcrun -f xcodebuild
	/Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild

## Disassemble the `xcodebuild` binary

You don't have to know the assembly language. 

I recommend the [Hopper Disassembler app](https://www.hopperapp.com). It can convert assembly to pseudo code that looks similar to Objective-C. It can also generate Objective-C header files, so that you can see all the methods & properties of all the objects.

Feel free to skip disassembling and just use the snippet below. You can always revisit this later.

### The main() method
In the main method, we will find that 80% of the code is just:

~~~objc
    int main(int argc, const char * argv[]) {
        @autoreleasepool {
            NSProcessInfo *processInfo = [NSProcessInfo processInfo];
            
            // Initialize the Xcode object that does actual work
            Xcode3CommandLineBuildTool *buildTool = [Xcode3CommandLineBuildTool sharedCommandLineBuildTool];
            
            // Pass all commandline arguments, except for the path to binary
            buildTool.arguments = [processInfo.arguments subarrayWithRange:NSMakeRange(1, processInfo.arguments.count-1)];
            
            // Use the same environment variables as the xcodebuild binary
            buildTool.environment = processInfo.environment;
            
            // Use standard output & error for logging
            buildTool.standardError = [NSFileHandle fileHandleWithStandardError];
            buildTool.standardOutput = [NSFileHandle fileHandleWithStandardOutput];

            // Standard input isn't used
            buildTool.standardInput = [NSFileHandle fileHandleWithNullDevice];
            
            // Run the command
            [buildTool run];
            
            // Return exit code
            return (int)buildTool.exitStatus;
        }
    }
~~~

# Create a `myxcodebuild` commandline tool
Lets start by creating a new macOS commandline tool called `myxcodebuild`. Use Objective-C rather than Swift as the language.


## Add Xcode framework headers

The Xcode frameworks do not include headers, so lets write or generate our own ones.

* You don't have to declare all the objects
* You don't have to declare all the methods & properties
* You can change type of any object property to `id`
* You can forward declare any object type with `@class Type;`
* You can forward declare any interface type with `@protocol Type;`

Declare just the parts you want.


### Add Xcode3CommandLineBuildTool.h

Lets add a `Xcode3CommandLineBuildTool.h` header:

~~~objc
#pragma once

#import <Foundation/Foundation.h>

@interface Xcode3CommandLineBuildTool : NSObject

@property long long exitStatus;
@property (copy) NSArray * arguments;
@property (copy) NSDictionary * environment;
@property (retain) NSFileHandle * standardInput;
@property (retain) NSFileHandle * standardOutput;
@property (retain) NSFileHandle * standardError;

+ (id)sharedCommandLineBuildTool;
- (void)run;

@end

~~~

This will let the compiler know that such object exists in one of the frameworks.

Later it's usefult to have access to all the methods and properties of `Xcode3CommandLineBuildTool`. The Hopper app can generate complete private headers.


## Implement the main method

Add the decompiled snippet to the main method:

```objc
#import <Foundation/Foundation.h>
#import "Xcode3CommandLineBuildTool.h"

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSProcessInfo *processInfo = [NSProcessInfo processInfo];
        
        // Initialize the Xcode object that does actual work
        Xcode3CommandLineBuildTool *buildTool = [Xcode3CommandLineBuildTool sharedCommandLineBuildTool];
        
        // Pass all commandline arguments, except for the path to binary
        buildTool.arguments = [processInfo.arguments subarrayWithRange:NSMakeRange(1, processInfo.arguments.count-1)];
        
        // Use the same environment variables as the myxcodebuild binary
        buildTool.environment = processInfo.environment;
        
        // Use standard output & error for logging, ignore standard input
        buildTool.standardError = [NSFileHandle fileHandleWithStandardError];
        buildTool.standardOutput = [NSFileHandle fileHandleWithStandardOutput];
        buildTool.standardInput = [NSFileHandle fileHandleWithNullDevice];
        
        // Run the command
        [buildTool run];
        
        // Return exit code
        return (int)buildTool.exitStatus;
    }
}
```


# Compile `myxcodebuild`

To compile succesfully `myxcodebuild` needs to be linked with all the required frameworks.

## Find `xcodebuild` dependencies

Each binary usually has a list of dependencies inside of it.

One way to read the `xcodebuild` dependencies is:

	otool -l /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild
	
This will output a list of binary's load commands, among them framework dependencies and their search paths.

### Libraries

The `LC_LOAD_DYLIB` load commands define the libraries that this binary will load on launch:

	name /System/Library/Frameworks/Foundation.framework/Versions/C/Foundation
	name @rpath/DVTFoundation.framework/Versions/A/DVTFoundation
	name @rpath/DVTDeviceFoundation.framework/Versions/A/DVTDeviceFoundation
	name @rpath/IDEFoundation.framework/Versions/A/IDEFoundation 
	name @rpath/Xcode3Core.ideplugin/Contents/MacOS/Xcode3Core
	name /usr/lib/libSystem.B.dylib
	name /System/Library/Frameworks/CoreFoundation.framework/Versions/A/CoreFoundation 

There are 3 Xcode frameworks loaded directly: `IDEFoundation`, `DVTFoundation`, `DVTDeviceFoundation` and a `Xcode3Core` plugin, which is very similar to a framework.

### Library search paths

The `LC_RPATH` load commands define the search locations (the `@rpath`) for libraries:

	path @executable_path/
	path @executable_path/../../../Frameworks
	path @executable_path/../../../SharedFrameworks
	path @executable_path/../../../PlugIns

When macOS is loading a dependency with `@rpath` in the path name, it will try all of those search paths in order.

Those are relative to location of `xcodebuild` inside Xcode.app bundle:

	/Applications/Xcode.app/Contents/Developer/usr/bin/
	/Applications/Xcode.app/Contents/Frameworks/
	/Applications/Xcode.app/Contents/SharedFrameworks/
	/Applications/Xcode.app/Contents/PlugIns/

## Add libraries as dependencies to `myxcodebuild`

We can use the Xcode libraries as they are inside Xcode.app, we don't need to copy them.

### Xcode Frameworks

Add framework bundles to `Linked Frameworks And Libraries` using the `Add Other...` button:

* `/Applications/Xcode.app/Contents/Frameworks/IDEFoundation.framework`
* `/Applications/Xcode.app/Contents/SharedFrameworks/DVTFoundation.framework`
* `/Applications/Xcode.app/Contents/SharedFrameworks/DVTDeviceFoundation.framework`

### Xcode Plugins

For plugins we need to add the binary directly rather than adding the directory.

Add `Xcode3Core` binary to `Linked Frameworks And Libraries` using the `Add Other...` button:

* `/Applications/Xcode.app/Contents/PlugIns/Xcode3Core.ideplugin/Contents/MacOS/Xcode3Core`

## Add custom build settings

Lets use an xcconfig file to keep new custom build settings in one place.

### Framework search paths

For the project to compile, linker needs to know where to find the frameworks:

	FRAMEWORK_SEARCH_PATHS = $(inherited) /Applications/Xcode.app/Contents/Frameworks /Applications/Xcode.app/Contents/SharedFrameworks
	
	LIBRARY_SEARCH_PATHS = $(inherited) /Applications/Xcode.app/Contents/PlugIns

### `@rpath` search paths

The frameworks will be loaded from specific locations when `myxcodebuild` is launched:
	
	LD_RUNPATH_SEARCH_PATHS = @executable_path /Applications/Xcode.app/Contents/Frameworks /Applications/Xcode.app/Contents/SharedFrameworks /Applications/Xcode.app/Contents/PlugIns


### Dependencies of dependencies

Try to compile and run the application. There will be one more error: `Xcode3Core` is trying to load macOS `XCTest.framework`, but `XCTest` is not in one of known paths.

If we look into `Xcode3Core` there will be some relative paths (`@loader_path`), but none pointing to directory with `XCTest.framework`

```
otool -l /Applications/Xcode.app/Contents/PlugIns/Xcode3Core.ideplugin/Contents/MacOS/Xcode3Core
```

	name @rpath/XCTest.framework/Versions/A/XCTest
	
	path @loader_path/../Frameworks
	path @loader_path/../../../
	path @executable_path/../Frameworks



Lets check `IDEFoundation`. It also loads `XCTest.framework` and one of the paths does point to the MacOSX Frameworks directory:

```
name @rpath/XCTest.framework/Versions/A/XCTest 
```
```
path @loader_path/../../../../Frameworks
path @loader_path/../../../../Developer/Platforms/MacOSX.platform/Developer/Library/Frameworks
path @loader_path/../../../../SharedFrameworks
path @loader_path/../../../../Developer/Library/Frameworks
```

Lets add it to the xcconfig:

```
LD_RUNPATH_SEARCH_PATHS = @executable_path /Applications/Xcode.app/Contents/Frameworks /Applications/Xcode.app/Contents/SharedFrameworks /Applications/Xcode.app/Contents/PlugIns /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/Library/Frameworks
```


## Make Xcode project work in any location


Once frameworks are added, they will appear in the Xcode Project Navigator on the left. By default paths to frameworks will be relative to the project file, which will break if the project is moved. We can make them relative to the Xcode.app so that it works in any location.



