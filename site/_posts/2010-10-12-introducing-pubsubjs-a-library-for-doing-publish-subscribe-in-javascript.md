---
title: Introducing PubSubJS, a Library for doing publish/subscribe in JavaScript
layout: post
topics: javascript
comments_disabled: false
---

For quite a while, I have been working on a large web application for a client. For [publish/subscribe](http://en.wikipedia.org/wiki/Publish/subscribe) style messaging in the web frontend, we use jQuery custom events triggered on the body element. This is quite a neat trick to ensure loose coupling of modules, since you're really just tracking what the user does, and not what module happened to generate the message.

This approach has been introduced to my team by me, and I have been very eager to help my team mates understand how to use it.

I have been so satisfied with this approach, that I've even given a talk about it the [JS Berlin meetup](http://groups.google.com/group/js-berlin). Others have also been quite taken with this approach, some are listed in the footnotes.

Recently, I've become less and less satisfied with this approach.

One of the problems you eventually will run into with using jQuery custom events for publish/subscribe, is that they're syncronous, so you will end up triggering new events, before you're done executing the handlers for the current event.

It get's messy, trust me.

## So why a new library?

Well, there are actually a number of reasons, that ultimately led me to look for a better way of doing publish/subscribe messaging in "JavaScript":https://developer.mozilla.org/en/JavaScript.

I wanted something that would meet most of these requirements:

* Published under a reasonable software license ( CC, MIT, BSD, Apache, WTFPL, etc)
* All messages should be passed async be default, anything else is just confusing
* No use of DOM (it's slow, and storing state in something you have no control over is silly)
* Pure "JavaScript":https://developer.mozilla.org/en/JavaScript, no library dependencies
* No side-effects, jQuery modifies subscribers (adding an "id" property to the functions)
* Should be able to run outside browsers
* Should have up to date documentation (or at least aligned with the codebase)
* Tests are important, ok?
* Small(ish)

Well, it turned out that my searches on the internet came up empty (my Google-fu could be better), so I decided to write an implementation myself. I call it [PubSubJS](http://github.com/mroderick/PubSubJS).

I've published it at <http://github.com/mroderick/PubSubJS>, you could take it for a spin, run the tests if you like, even fork it and contribute to it.

## So what can this PubSubJS do?

Not a lot.

Basically, you can subscribe to messages, publish messages (with a payload) and unsubscribe from messages. If you're feeling adventurous (or really believe that you have 100% understanding of the consequences), you can also force message publication to be syncronous.

Let's see some code already!

{% highlight javascript %}
// subscribing to messages is quite easy,
// first we'll create a subscriber function
var logToConsole = function( message, data ){
    // once a message arrives, it'll get logged to the console
    // data passed in messages can be whatever you want
    console.log( message, data );  
};

// every subscription gives you a token,
// you should keep it if you want to unsubscribe
var token = PubSub.subscribe( 'some message', logToConsole );

// publishing messages is also quite easy
PubSub.publish( 'some message', 'hello world!' );

// now let's unsubscribe from this message
PubSub.unsubscribe( token );
{% endhighlight %}

So, as you can see, it's fairly simple to work with.

To illustrate the difference in execution speed of working with [JavaScript](https://developer.mozilla.org/en/JavaScript) and JavaScript + DOM, I've created a [JSPerf.com](http://jsperf.com/) testpage, that [compares PubSubJS performance to jQuery custom events](http://jsperf.com/pubsubjs-vs-jquery-custom-events). You should go check it out.

## So, should I use it?

No! &hellip; Well, maybe &hellip;

If you're building larger web applications where you need to have loose coupling between your modules / components / widgets / whatnots, then publish/subscribe *can* be the answer you're looking for.

If you happen to build larger web applications with Dojo and need publish/subscribe, then I recommend you look at the implementation that's already IN Dojo, or get in touch with "Rebecca Murphey":http://www.rebeccamurphey.com/ ;-)

Consider this: publish/subscribe is a bit like explosives. In the hands of thoughtful experts, you can expect to have a sky scraper demolished safely and in a reasonable time frame. In the hands of amateurs, working with explosives, you'll end up with some very noisy and messy situations when you least expect it. And sure, every once in a while, even experts make mistakes.

"So why even write a publish/subscribe library?" you may ask, and the answer is simple: I need it, just like demolition experts need access to high grade, stable and predictable explosives.

Don't say I didn't warn you.

<hr />

* [Sammy.js](http://code.quirkey.com/sammy/) also uses jQuery custom events. I am however trying to convince Aaron to use pure JavaScript publish/subscribe messaging instead.
* [Handling Errors and Loading Notifications with Publish and Subscribe](http://enterprisejquery.com/2010/09/creating-an-ajax-component-handling-errors-and-loading-notifications-with-publish-and-subscribe/)

After writing PubSubJS, I discovered that Peter Higgins has implemented [publish/subscribe for jQuery](http://github.com/phiggins42/bloody-jquery-plugins/blob/master/pubsub.js)