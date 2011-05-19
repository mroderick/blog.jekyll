---
title: jQuery Data Link considered harmful
layout: post
topics: javascript
comments_disabled: false
---

"Considered harmful" has always been good link bait. 

I am not trying to start a flamewar, but merely express my concerns over the recent decisions of the jQuery team to actively endorse plugins that deserves no special treatment from any other plugins out there.

If you have different opinions, please do respond in the comments or write a blog post expressing them. 

## Extending globals with interesting side effects

When Prototype was first released, everyone was **really** excited and could suddenly do a lot more with JavaScript across browsers, that would have been considered almost a black art before (to some it still is).

Prototype allowed us previously unseen productivity as the library matured and evened out the playing field between browser capabilities, quirks and different interpretation of specs.

You no longer had to know every little browser quirk to be able to work successfully with JavaScript, Prototype was the catalyst that allowed a lot newcomers to JavaScript to pick up the tools and get some actual work done.

On the whole Prototype played a crucial role in speeding up the Ajax revolution, and has inspired many others to build excellent JavaScript frameworks and libraries. We owe a lot of thanks to the creators, maintainers and contributors of Prototype.

But, Prototype is not all double rainbows and have certainly made some mistakes that they're still paying for. Over the years the Prototype library has been getting a lot of grief over extending the native prototypes and extending the DOM, both of which are considered bad practices.

For a history lesson on why all of this is considered bad practice:

* <http://erik.eae.net/archives/2005/06/06/22.13.54/>
* <http://perfectionkills.com/whats-wrong-with-extending-the-dom/>
* <http://andrewdupont.net/2006/05/18/javascript-associative-arrays-considered-harmful/>
* <http://www.nczonline.net/blog/2010/03/02/maintainable-javascript-dont-modify-objects-you-down-own/>

What the whole discussion about not extending globals and not modifying objects you don't own boils down to is this:

* Collisions causes very hard to find bugs
* Avoiding collisions is very, very difficult
* DEVELOPERS DON'T LIKE SURPRISES

##  Data in the DOM is the new extended prototype ^h global scope

Fast forward to present day.

Today, the most popular JavaScript library is undeniably jQuery.

jQuery is where a lot of newcomers to JavaScript will start. This is where they will pick up the tools, the practices and look for guidance. With the current landscape of libraries, that's not a bad choice.

Just like Prototype paved the way for developers to get started with JavaScript, jQuery today makes it *easy* to get started and to get some work done.

There is plenty of good learning material about jQuery to absorb out there, both on the internet and even in bookstores and libraries.

The jQuery team has been very vigilant in not leaking anything into the global scope, not extending the globals or extending the DOM. The api is documented and very thoroughly tested.

On the whole, jQuery tries incredibly hard to not create collisions and not surprising it's users.

Sure there are still a few surprises: jQuery custom events are using the DOM to store data about subscribers to specific events. But, that's actually reasonable compromise when you consider that they found it important to have the events bubble and be just like the native events of the DOM. It is unfortunate that they're simply stored under a name of "events", and doesn't use a more unique key like "jquery-custom-events" ... I've already discovered one clash with this, leading to unexpected side effects.

Clearly, the maintainers of jQuery have taken the lessons from the mistakes of Prototype to heart.

Until now.

### jQuery Data Link plugin

The jQuery team is now making the same mistakes that the Prototype team got chastised over, maybe not in jQuery Core itself, but with accepting overly complex and mostly untested plugins as official ones.

One of these is the [Data Link plugin](https://github.com/jquery/jquery-datalink), which allows developers to link DOM elements to JavaScript objects and vice versa.

We've seen this pattern before ... we've agreed that having a direct and strong coupling between the DOM and our code is just plain stupid.

Data Link makes heavy use of the `changeData` event introduced in jQuery 1.4.3, and seems to work almost automagically... too automagically.

I am surprised that someone as experienced as John Resig is [actually endorsing this](http://blog.jquery.com/2010/10/04/new-official-jquery-plugins-provide-templating-data-linking-and-globalization/) misguided practice.

The plugin has even [made it's way into the official documentation of jQuery](http://api.jquery.com/category/plugins/data-link/), even though it can by no stretch of the imagination be considered of the same quality as the rest of the official jQuery code.

Data Link *has no automated test cases*. Go [see for yourself at GitHub](https://github.com/jquery/jquery-datalink).

If there are no test cases, how are we supposed to assess the maturity of the code? How are we going to contribute to it it, without causing defects?

Unsurprisingly, Data Link originates from Redmond, the same company that "blessed" frontend developers with the much hated ViewState and hijacking as much as they could in our browsers, effectively creating a breeding ground for collisions and very strong ties between the client side code and server side code.

## Collisions made easy with Data Link

I present to you: an easy to follow recipe for creating collisions with Data Link.

Imagine this: you're building an app where you would like to use Data Link to have easy updates of your JavaScript objects whenever form fields change, using the "dataChange" event. And, having the form elements automatically updated whenever your JavaScript object changes, seems handy as well.

There's plenty documentation on how to achieve this on the [Data Link plugin page on GitHub](https://github.com/jquery/jquery-datalink).

Now imagine that you'd like to use some of the elegant features of HTML5, like [placeholder attribute](http://diveintohtml5.org/forms.html). Modern browsers already support this, and there are several [good](https://github.com/mathiasbynens/Placeholder-jQuery-Plugin) [examples](http://robertnyman.com/2010/06/17/adding-html5-placeholder-attribute-support-through-progressive-enhancement/) on how to retrofit older browsers to enhance the user experience.

And voila! you've now made sure that your JavaScript objects automatically gets populated with the example text that you use in the placeholder attributes. Well done!

Now imagine that you're using two different plugins that rely on Data Link, and you've got a recipe for some really, really hard to find collisions.

But that's OK, because you're a JavaScript ninja and know the internals of jQuery (and all the plugins) like the back of your own hand and jQuery has always been your friend.

&hellip; or perhaps you're new to JavaScript and have chosen to use jQuery because it's the popular choice and get's endorsed by large multinationals. Well, if this is the case, you're screwed, jQuery just became a LOT harder for you to use, and teaches you absolutely nothing.

## Simplicity and uni-lateral control over open source

In a comment to the question of [How could YUI3 improve its image compared to jQuery](http://www.quora.com/How-could-YUI3-improve-its-image-compared-to-jQuery-MooTools-etc/answer/John-Resig?srid=5i2) John states

> Simplicity is far harder to get right than building complex applications.

He couldn't be more right.

Data Link is by no means simple, and it's use will lead to a a lot of interesting collisions. 

Accepting Data Link as an official plugin and having jQuery endorse it, is in my opinion a mistake, especially considering it's maturity.

In the very same comment, John also states

> Yahoo completely controls the direction and destiny of YUI. This should not be the case ...

This seems to suggest that we can talk Resig out of actively pushing Data Link, and focus his efforts on making jQuery itself the best it can be.

p. What do you think?