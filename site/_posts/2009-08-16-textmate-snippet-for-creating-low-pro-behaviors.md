---
title: TextMate snippet for creating Low Pro Behaviors
layout: post
topics: textmate javascript lowpro
disable_comments: true
---

# TextMate snippet for creating Low Pro Behaviors

## Behaviours

To encapsulate complex javascript behaviour on websites, I have been using [Dan Webb's Low Pro](http://www.danwebb.net/lowpro) library for several years. Low Pro allows you to create self-contained Behavior classes, which avoids polluting the global namespace with variables and makes for very easy re-use of code.

I've previously given a little [introduction to Low Pro for Prototype](http://roderick.dk/blog/2009/05/07/introduction-to-low-pro-for-prototype/) at a local Meetup event, where I show an example of creating your own behaviours.

## Textmate snippet

Today, I finally got around to creating a [TextMate snippet for creating new Behaviors](http://gist.github.com/168604).

[TextMate snippets](http://manual.macromates.com/en/snippets) are an easy way of optimising your daily coding, by automating the writing of some of your code. They're surprisingly simple to work with.

> In the simplest case, you can use snippets to insert text that you do not want to type again and again, either because you type it a lot, or because the actual text to insert is hard to remember (like your bank account details or the HTML entities for the Apple modifier keys).

Activating the snippet and filling in the options (class name, default options, etc) will give you something like this:

{% highlight javascript %}
/**
 * class MyBehavior
 * Behavior class for managing behavior of ...
 * See http://www.danwebb.net/2006/9/3/low-pro-unobtrusive-scripting-for-prototype
 **/
var MyBehavior = Behavior.create({
  options : {
    myOption : 'myOptionDefaultValue'
  },

  /**
   * MyBehavior#initialize( [ opts = { myOption : 'myOptionDefaultValue' }] )
   * - options (Object): Will be merged with the default options, good for 
   *   overriding texts, urls, dom references, etc
   * Gets called when the element is loaded	
   **/
  initialize : function( opts ){
    this.options = (this.options).merge( opts ).toObject();
    // alert( this.options.myOption )
  }
);
{% endhighlight %}

The snippet is [available on github](http://gist.github.com/168604), should you feel the need to customize or improve it.

<a rel="license" href="http://creativecommons.org/licenses/by-sa/2.5/dk/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/2.5/dk/80x15.png" /></a>