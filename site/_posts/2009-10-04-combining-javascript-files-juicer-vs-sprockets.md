---
title: Combining JavaScript Files - Juicer vs Sprockets
layout: post
topics: javascript juicer sprockets
idcomments_post_id: http://roderick.dk/blog/2009/10/04/combining-javascript-files-juicer-vs-sprockets/
---

# Combining JavaScript Files - Juicer vs Sprockets

Currently working on a project that has well defined use of "namespaces" and structured use folders for its JavaScript files. I wanted to investigate the options for combining and minifying JavaScript files.

I need a tool that:

* can be run from command line (my team uses many different editors and IDEs)
* will work on both Windows and Unix based platforms
* does not require huge, obscure configuration files
* can merge sources recursively
* has an acceptable software license (MIT / Apache / BSD)
* is thorougly tested
* is extensible
* can work with any JavaScript framework

I settled for trying out [Juicer](http://github.com/cjohansen/juicer) and [Sprockets](http://getsprockets.org), since both tools met the requirements and were the only high-quality tools on my radar.

Feel free to suggest more tools to try out in the comments.

Both Juicer and Sprockets use Ruby, so make sure you have a recent Ruby and Rubygems installed if you want to experiment with them. Most developers that care enough about good frontend performance seem to have Ruby anyway these days.

I tested the tools with Ruby 1.8.7 on OS X 10.6.1.

## Juicer

License: MIT

URL: <http://github.com/cjohansen/juicer>

I first became aware of Juicer when Christian Johansen released the 0.2.0 version to the public about six months ago. Since then I have been wanting to try it out for work related projects.

### Installation

Installation of Juicer is pretty straight forward

{% highlight bash %}
$ gem install juicer
$ juicer install yui_compressor
$ juicer install jslint
{% endhighlight %}

### Usage

Using Juicer for JavaScript dependency management is pretty straight forward, in your code you simply specify dependencies with the @depend keyword and juiced picks up on this and merges the files automagically.

{% highlight javascript %}
/**
  * My script file
  *
  * @depend jquery-1.2.0.js
  */
  var myNS = {
    myObject = {}
  };
{% endhighlight %}

To merge the dependencies into the file you simply run

{% highlight javascript %}
$ juicer merge myfile.js
{% endhighlight %}

This will produce a new file, `myfile.min.js`, which contains all dependencies merged in. It parses each dependency and resolves it's dependencies as well. The file will be stripped of all comments and minified, this is highly configurable, if you know how to use [YUI Compressor](http://developer.yahoo.com/yui/compressor/) (and you should know this).

### Bonus features

* Builtin use of [JsLint](http://www.jslint.com/)
* Builtin use of [YUI Compressor](http://developer.yahoo.com/yui/compressor/)
* Can merge CSS files
* Can create cache buster urls for assets referenced by css files
* Can cycle asset hostnames for asset urls in css files

## Sprockets

License: MIT

URL: [http://getsprockets.org](http://getsprockets.org)

To my knowledge, Sprockets was released at around the same time as Juicer, both projects seemed to be blissfully unaware of each other. Sprockets is created by Sam Stephenson of Prototype fame.

### Installation

Installing Sprockets is a no brainer, if you have ruby

{% highlight bash %}
$ gem install --remote sprockets
{% endhighlight %}

This will give you a gem, with all you need to run Sprockets, including a "sprocketize" command.

### Usage

Using Sprockets for JavaScript dependency management is very easy, you specify dependencies in your source code with the `//= require` notation, and it will resolve the dependencies for you.

{% highlight javascript %}
//= require "jquery-1.2.0"
/**
  * My script file
  */
  var myNS = {
    myObject = {}
  };
{% endhighlight %}

To merge the dependencies in, you simply run the `sprocketize` command on the file, specifying where the output should go.

{% highlight bash %}
$ sprocketize myfile.js > myfile.combined.js
{% endhighlight %}

This creates the merged file, with all dependencies merged in, neat and to the point. Sprockets has many subtleties that allows for greater control and for easier reading of the dependency directives. Luckily, it's very well documented, reading the documentation for the finer points is recommended.

### Bonus features

* Bundling of assets, to create release builds with all dependencies like CSS, images, flash files. Very neat.
* Support for insertion of constants into the code (like version numbers, authors, i18n, etc)
* Sprockets is really a well structured Ruby library, so you can just keep extending and building on it
* Rails plugin (well, only a bonus if you use Rails)
* CGI script for serving outside Rails

Sprockets does not come with JsLint or YUI Compressor builtin, you will have to add this to your build script yourself. This should not be that much of an issue, as you will probably want to be able to create several diffent builds for yourself anyway.

## The verdict

Sprockets seem very well suited for framework authors, not surprising since it originated from the Prototype JS framework.

Juicer has some very compelling features for optimizing the use of CSS files and resources referenced by these files.

Both Juicer and Sprockets are carefully crafted tools and show great maturity. Both projects encourage contributions and are both hosted on GitHub, so collaboration is really easy.

Setting up each tool and using it for merging dependencies for a large project with many JavaScript files took me about half an hour.

I can only recommend that you try out both tools and see which one fits best with YOUR plans for World Domination&trade;.