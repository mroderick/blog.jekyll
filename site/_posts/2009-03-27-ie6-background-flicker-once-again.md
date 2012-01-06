---
title: IE6 Background flicker once again
layout: post
topics: IE6 javascript
disable_comments: true
---

# IE6 Background flicker once again

Every once in awhile you come across one of those Internet Explorer 6 issues that tries it's hardest to be really annoying. Today was one of those days with IE.

Having flown out to work directly with a client's web team yesterday, I spent some time today cursing at IE6 and trying to deal with a weird flickering of the webpage, apparently caused by hovering over a menu.

After about 40 minutes, I had the palm--meets--forehead "heureka" moment, and recognised that the bug I was seeing was in fact the infamous IE6 background flicker bug, which I've exterminated on other sites before.

In order not to forget about the solution immediately, I am posting it here. Perhaps it may also shortcut the synapses of another developer and save them some time trying to squash this bug.

I cannot take credit for the solution, I am just posting my preferred version of it here for posterity. The solution is very simple, albeit a bit obscure.

{% highlight javascript %}
// prevent background flickering bug in Internet Explorer 6
try {
	document.execCommand("BackgroundImageCache",false,true));
} catch(e) {}
{% endhighlight %}

To avoid pollution the rest of the website for users with modern browsers, I prefer to stick this in my IE6.js file and load it using conditional comments.

{% highlight html %}
<!--[if lte IE 7]>
	<script type="text/javascript" src="/javascripts/ie6.js"></script>
<![endif]-->
{% endhighlight %}

This is yet another example of developers using Internet Explorers misguided proprietary extensions to counter some of all the obscsure bugs.

## When should I use this?

You should be using this fix on every site that uses background images and mouse over effects ... so basically, you should *always* be using this for sites that need to support IE6, and so should I.

Thankfully, we're seeing the start of a global movement to be rid of IE6 once and for all, and soon we will be able to throw out all the weird fixes for Internet Explorer 6.

Recently, DR (Denmarks Radio) announced that they're [dropping IE6 for IE8 on the machines of 3.000 employees](http://www.version2.dk/artikel/10451-dr-dropper-internet-explorer-6) ... and with more and more organisations finally moving out of the dark ages, we can finally lay this old horse to rest.

## This fix seen elsewhere

* [A forensic analysis of the IE6 BackgroundImageCache command identifier](http://misterpixel.blogspot.com/2006/09/forensic-analysis-of-ie6.html)
* [No more IE6 background flicker](http://evil.che.lu/2006/09/25/no-more-ie6-background-flicker)

## Update - Fixing it server side

[Robert Nyman](http://www.robertnyman.com) pointed me towards [Dean Edwards' solution using expiration headers](http://dean.edwards.name/my/flicker.html), which you should be setting anyway, see ([YDN article - Add an Expires or a Cache-Control Header](http://developer.yahoo.com/performance/rules.html#expires)).

To improve user experience, we've been adding cache-control headers to just about everything for quite some time, so maybe that is why IE6 background flickering is a problem we don't encounter that frequently anymore.

It's good to know that you have options.