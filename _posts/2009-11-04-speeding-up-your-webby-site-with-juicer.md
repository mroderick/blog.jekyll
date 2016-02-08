---
title: Speeding Up Your Webby Site With Juicer
layout: post
topics: webby juicer css performance
disable_comments: true
---

# Speeding Up Your Webby Site With Juicer

On this blog I use several stylesheets to keep things (somewhat) organised. This allows me to upgrade my `coderay.css` file or my [Tripoli CSS](http://devkick.com/lab/tripoli/) stylesheets without having to reorganise everything.

But, just because I like to organise my code into managable chunks, doesn't mean that I have to degrade the performance of the site for the visitors.

To help me improve performance by both reducing total transfer size and amount of requests for stylesheets, I've added [Juicer](http://github.com/cjohansen/juicer) to the mix.

Juicer requires a few gems and Java (as it uses [YUI Compressor](http://developer.yahoo.com/yui/compressor/) internally to minify stylesheets), but if you're still reading, this should not be a problem for you.

## The stylesheets

Firstly, I've created two _driver_ stylesheets, that is responsible for importing the other stylesheets in the correct order.

First, the stylesheet for modern browsers.

```css
/* master.modern.css - holds stylesheets for modern browsers */
@import url(/stylesheets/tripoli/tripoli.simple.css);
@import url(/stylesheets/coderay.css);
@import url(/stylesheets/base.css);
```

Second, the stylesheet older versions of Internet Explorer

```css
/* master.ie7.css - loads stylesheets for IE7 and lower */
@import url(/stylesheets/tripoli/tripoli.simple.css);
@import url(/stylesheets/tripoli/tripoli.simple.ie.css);
@import url(/stylesheets/coderay.css);
@import url(/stylesheets/base.css);
@import url(/stylesheets/ie7.css);
```

Steve Souders has explained that [you should not use @import](http://stevesouders.com/blog/2009/04/09/dont-use-import/) in your stylesheets, as it will block parallel downloads. But, don't worry, Juicer will combine all of these stylesheets into one and all will be well in the world.

## The rake file

To control the behaviour of Juicer, I've created a little rake task.

```ruby
# juicer.rake
namespace :juicer do
  namespace :merge do
    desc 'Merges stylesheets'
    task :stylesheets do
      sh 'juicer merge content/stylesheets/master.modern.css -o content/stylesheets/master.modern.min.css --document-root content --force'
      sh 'juicer merge content/stylesheets/master.ie7.css -o content/stylesheets/master.ie7.min.css --document-root content --force'
    end
  end
end
```

You should update the rake task with the correct paths and filenames for your site.

## Updating the Sitefile

In order for Webby to generate these new files, you will need to update your `Sitefile`, and instruct Webby to run the merge task with every build. To do this you simply add a dependency for the built-in build tasks.

```ruby
# add these lines to your Sitefile
desc "Build the website"
task :build => [:configure_basepath, 'juicer:merge:stylesheets' ]

desc "Rebuild the website"
task :rebuild => [:configure_basepath, 'juicer:merge:stylesheets' ]

desc "Continuously build the website"
task :autobuild => [:configure_basepath, 'juicer:merge:stylesheets' ]
```

Using the new merged stylesheets couldn't be easier, you just reference them by their new names `master.modern.min.css` and `master.ie7.min.css`.

## Results

For this blog, the result is ~2kb and 2 or 4 connection requests saved, if your site has bigger and/or more stylesheets, you're going to see even better results.

As an added bonus, Juicer also adds cache buster suffixes to all image references in the stylesheets (this is configurable), so now I can safely turn on expiration headers for these images and my (repeat) visitors can enjoy an even faster site.
