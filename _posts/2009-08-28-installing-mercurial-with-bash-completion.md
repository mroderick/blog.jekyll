---
title: Installing Mercurial With Bash Completion from MacPorts
layout: post
topics: osx mercurial
idcomments_post_id: http://roderick.dk/blog/2009/08/28/installing-mercurial-with-bash-completion/
---

# Installing Mercurial With Bash Completion from MacPorts

Now that Snow Leopard is out, I ran into a few issues with some of my installed ports. Upgrading them to run on the new 64-bit OS also gave me some grief.

I decided to just start over with a clean slate for all my ports.

Make sure to install the latest XCode (and perhaps Apple's X11 from the optional installs) from the Snow Leopard DVD. Once that is done, you should install v1.8.0 of MacPorts. As usual, [there are detailed instructions on the MacPorts website](http://www.MacPorts.org/install.php).

You can find details on [how to uninstall your installed ports](http://trac.MacPorts.org/wiki/FAQ#uninstall) on the MacPorts wiki.

If you're installing Mercurial from MacPorts, do get the bash_completion variant, as it's much nicer to work with on a daily basis.

*At the time of writing, python26 won't install from MacPorts on Snow Leopard*. Python 2.6 is a requirement for Mercurial. The issue is [very actively being worked on by your friendly MacPorts maintainers](http://trac.MacPorts.org/ticket/20284), so just have a little patience.

While we wait patiently, you can always take the opportunity to learn more about Mercurial, there are several good resources:

* [Mercurial: The definitive guide](http://hgbook.red-bean.com/) is a freely available online, and will be printed by O'Reilly later this year.
* [PeepCode screencast: Meet Mercurial](http://peepcode.com/products/meet-mercurial)  by Dan Benjamin
* [Meet Mercurial](http://hivelogic.com/articles/meet-mercurial/), article where Dan Benjamin introduces us to his screencast and offers a little background.
* [Mercurial Wiki](http://mercurial.selenic.com/wiki/)
* [Git vs. Mercurial: Please Relax](http://importantshock.wordpress.com/2008/08/07/git-vs-mercurial/) ... I enjoyed this thoroughly.
* [BitBucket](http://bitbucket.org/) hosts your Mercurial repositories, if you can't be bothered doing it yourself (it's really not that hard). Very nice for collaboration though.

Once the python26 port is working on Snow Leopard (probably fixed by the time you read this), you should treat yourself to having bash completion for Mercurial.

All you need to do to attain bliss, is just to instruct MacPorts to install the bash completion variant.

```shell
$ sudo port install mercurial +bash_completion
```

Such a long post for a little port statement :-)

*Update*: You can also install [pre-built binaries](http://mercurial.berkwood.com/) while we wait for the fix to the MacPorts version, that's what I've done.

*Update - 2009-09-12*: The awesome MacPorts maintainers have fixed python26 port some days ago, so there are no longer any problems installing Mercurial with bash completion from MacPorts.
