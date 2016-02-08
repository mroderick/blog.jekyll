---
title: Fixing Bus Error / Segfault in Rcov
layout: post
topics: ruby coverage rcov
disable_comments: true
---

# Fixing Bus Error / Segfault in Rcov

We have recently run into problems with "rcov":http://eigenclass.org/hiki/rcov crashing with seemingly random errors, like

``` shell
/Library/Ruby/Gems/1.8/gems/activesupport-2.1.1/lib/active_support/core_ext/symbol.rb:11: [BUG] Bus Error ruby 1.8.6 (2008-03-03) [universal-darwin9.0]
```

Having CruiseControl.rb suddenly claim that all builds are broken, get's to be very annoying. Working on a large project without coverage reports is just not the same, once you get hooked on thoroughly testing the application you're working on.

After some hunting around on Google, it turns out that [others](http://eigenclass.org/hiki/rcov-0.8.1) have run into [similar problems](http://rspec.lighthouseapp.com/projects/5645/tickets/309-fix-for-rcov-segfault).

Chad Humphries has kindly put together a [replacement rcov gem (spicycode-rcov)](http://github.com/spicycode/rcov/tree/master) to use, while we wait for [the original rcov](http://eigenclass.org/hiki/rcov) to be updated.

To use the spicycode-rcov gem, you must first get rid of your old rcov gem:

``` shell
sudo gem uninstall rcov
```

And then just install spicycode-rcov

``` shell
  sudo gem install spicycode-rcov
```

The requirements for building spicycode-rcov should be the same as building the original rcov, so if you got that working already, you should have no problems.

This was originally posted by me on the Gazebo blog at 2008-11-16 at 07:36. That blog is no longer updated, so I have moved the post here.
