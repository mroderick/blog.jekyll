---
layout: default
title: Using PubSubJS with jQuery
site_section: 
---

# Using PubSubJS with jQuery

It was always possible to use PubSubJS with jQuery by using the `PubSub` global, see the [introduction to PubSubJS](./2010/10/12/introducing-pubsubjs-a-library-for-doing-publish-subscribe-in-javascript/) or check the examples in the [README](https://github.com/mroderick/PubSubJS/blob/master/README.md).

Some projects prefer their JavaScript to have a more uniform and jQuery like style. From v1.3.0, [PubSubJS](https://github.com/mroderick/PubSubJS) comes with support for just that.

## Build jquery.pubsub.js

In order to use PubSubJS with jQuery, we need to build a local copy of `jquery.pubsub.js`.

{% highlight bash %}
$ git clone https://github.com/mroderick/PubSubJS.git
$ cd PubSubJS
$ rake jquery # produces jquery.pubsub.js
{% endhighlight %}

We now have a `jquery.pubsub.js` file that needs to be copied into our project.

## Add jquery.pubsub.js

Use the `jquery.pubsub.js` file instead of `pubsub.js` and make sure you load it after jQuery has loaded. 

{% highlight html %}
<!doctype html>
<html>
    <head>
        <script src="jquery-1.7.2.js"></script>
        <script src="jquery.pubsub.js"></script>
    </head>
</html>
{% endhighlight %}

## Start using jquery.pubsub.js

{% highlight javascript %}
$(document).ready(function(){
    // create a topic and a function to subscribe to that topic
    var MY_TOPIC = 'my very exciting topic',
        subscriber = function( topic, data ){
            if ( window.console ){
                console.log( data );    
            }                   
        };

    // create a subscription
    var subscription = $.pubsub( 'subscribe', MY_TOPIC, subscriber );

    // publish the topic
    $.pubsub( 'publish', MY_TOPIC, 'hello world' );

    // publish the topic syncronously
    $.pubsub( 'publishSync', MY_TOPIC, 'hey world!' );

    // use a timeout to allow async propagation to finish before removing subscribers
    setTimeout(function(){
        // remove a specific subscription by passing the subscription token returned when creating the subscription
        $.pubsub( 'unsubscribe', subscription );

        // remove all subscriptions for a subscriber, by passing the subscriber
        $.pubsub( 'unsubscribe', subscriber );
    }, 0);
});
{% endhighlight %}

If you run the example above, you will see the following in the browser's console:

{% highlight bash %}
hey world!
hello world
{% endhighlight %}

You can also [see this example in action](example.html).

## Slow transition

If you're already using PubSubJS with the `PubSub` global and want to switch to using the jQuery syntax, you have no worries. It is entirely possible to use both notations at the same time, you don't have to update your existing code, but can ease into using the jQuery syntax.