---
title: Simulate slow web connections
layout: post
---

# Simulate slow web connections

While you're working on your own computer and accessing webapps running on that computer, response times are going to be __fast__. Most of the day, this is what we want. Working on your local machine, your webapp should be as fast as you can possibly make it.

But, for some situations, we need to examine how our application behaves when network connections are suboptimal.

On unix based systems there are a multitude of ways to slow down connection speeds of the entire system. Asking on Twitter, I learned that Apple recently released [Network Link Conditioner](http://mattgemmell.com/2011/07/25/network-link-conditioner-in-lion/) for OSX Lion.

But, I really don't want to slow down my entire system all day, just because I happen to want to test specific behaviour of just one of the hundreds of applications running on my computer. Then what?

What I need is to run a local proxy, that can slow down trafic and simulate slow web connections.

## Charles Proxy

My weapon of choice is [Charles Proxy](http://www.charlesproxy.com/). It is reasonably priced and is available on Windows, Mac OSX and Linux.

> Charles is an HTTP proxy / HTTP monitor / Reverse Proxy that enables a developer to view all of the HTTP and SSL / HTTPS traffic between their machine and the Internet. This includes requests, responses and the HTTP headers (which contain the cookies and caching information).

I often use Charles Proxy to verify that servers are sending the correct caching headers, or to inspect the exact requests that are being sent by browsers.

However, today we're going to look at how we can use Charles Proxy to simulate slow network connections.

### 1. Connect to the proxy

First, we need to make sure we are connecting through the the Charles proxy. For this example we will use the option to have Charles automatically configure Firefox. In the Proxy menu, choose "Mozilla Firefox Proxy".

![Choose "Mozilla Firefox Proxy"](/images/2012-05-11-simulate-slow-web-connections/charles-firefox-proxy.png)

When enabling this option, Charles will set the proxy settings in Firefox to be similar to these.

![Automatic proxy settings in Firefox](/images/2012-05-11-simulate-slow-web-connections/firefox-proxy-settings.png)

If you set the option to use recording as shown in the first screenshot, you will be able to see network trafic in the left hand pane.

![Image of recording of network trafic in Charles Proxy](/images/2012-05-11-simulate-slow-web-connections/charles-recording-is-working.png)

(Yes, I am writing this in Finland, and Google is still deciding that I want Finnish even though my request clearly states that I prefer "en-us", which they support.)

### 2. Enable bandwidth throttling

Now that we have it up and running and we can record all the trafic, let's activate bandwidth throttling!

On OSX you can turn throttling on and off using ⌘T. As you can see from the following screenshot, there are plenty of parameters to define the characteristics of the network provided through the proxy.

![Throttling options in Charles Proxy](/images/2012-05-11-simulate-slow-web-connections/charles-throttling-options.png)

## 3. Bonus: simulate slow connection while testing your app from iPad, iPhone, Android tablets, anything really.

Now for the killer feature, that got me all excited and inspired me to write this post.

Using the Reverse Proxies feature, you can provide a throttled proxy to any device on your local network.

To use it, go to the Reverse Proxies options page in the Proxy menu.

Here you should add a new reverse proxy. The Local Port is the port on the local system that remote clients should connect to. The Remote Host should be 127.0.0.1 (the local system) and the Remote Port is the port on your local system that your webapp is running on.

Here's an example.

![Throttling options in Charles Proxy](/images/2012-05-11-simulate-slow-web-connections/charles-reverse-proxy.png)

I would like remote clients to connect on port __58549__<br/>
I would like to direct trafic to localhost, e.g. __127.0.0.1__<br/>
My web application is running on port __8000__

My computer's name is morgbook, so the bonjour name that it publishes on the local network is morgbook.local.

In this example, if I want to test stuff on my iOS device with full speed of the wifi, I would connect to <http://morgbook.local:8000>, and if I want to test with reduced speed on my iOS device, I would connect to <http://morgbook.local:58549>. (This is true for any device on the local network, even my own computer).

With the combination of the throttling feature and the reverse proxy, we no longer need the automatic configuration of proxies in Firefox, and can easily see in the address field in any browser, if it's accessing our webapp on a slow connection.

If we wanted to, we could easily simulate a slow connection to any webserver on the internet and provide that slow connection to your local devices. I'll leave that as exercises to the reader.