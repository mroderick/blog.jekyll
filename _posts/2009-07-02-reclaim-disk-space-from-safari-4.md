---
title: Reclaim Disk Space From Safari 4
layout: post
topics: safari osx
idcomments_post_id: http://roderick.dk/blog/2009/07/02/reclaim-disk-space-from-safari-4/
---

# Reclaim Disk Space From Safari 4

Having a MacBook Pro that seems to be continually low on disk space, I set out to tidy up a bit using the [excellent and free OmniDiskSweeper](http://www.omnigroup.com/applications/omnidisksweeper/). It will help you identify where all your disk space is going. Use with caution though, and always have a recent backup.

After tidying up all over the file system, I noticed that the Safari cache was enourmous ... 1.2GB in my case. Further investigation revealed that most of that space was taken up by Webpage Previews, used by the top sites feature in Safari 4. As I don't care for that feature, I have disabled it with the following command

```shell
$ defaults write com.apple.Safari DebugSafari4IncludeTopSites -bool NO
```

But, that doesn't prevent Safari 4 from writing a lot of files into the filesystem. So either I would have to remove them manually at intervals ... but most developers prefer to automate trivial tasks.

## Enter scripting

OS X has excellent support for creating your own scripts and will allow you to do pretty much everything using the terminal, including creating your own scripts.

So, to remove all the unwanted files from the filesystem, I created the following script, which I named `remove_webpage_previews`

```shell
#!/bin/bash
find ~/Library/Caches/com.apple.Safari/Webpage\ Previews -mtime +1 -and -not -type d -delete
```

It finds all non-directory entries in the Webpage Previews folder with a modification time greater than one day. If you like using the top sites feature, you might want to use something like 14-30 days.

I keep scripts such as these in `~/bin`, but you may keep them elsewhere.

To make the script executable, you need to set it as executable in the filesystem using the following command:

```shell
$ chmod +x ~/bin/remove_webpage_previews
```

### Testing the script

First, measure how much space is currently being taken up by webpage previews

```shell
$ du -h ~/Library/Caches/com.apple.Safari/Webpage\ Previews
867M
```

Run the cleanup script, this might take up to a few minutes to execute, if you have many files ... I had a few thousand to begin with.

```shell
$ bin/remove_webpage_previews
```

Measure again, hopefully you should see a difference

```shell
$ du -h ~/Library/Caches/com.apple.Safari/Webpage\ Previews
252M
```

## Automation - Enter Lingon

If your script is succesful, you should register it with `launchd`, and have it run automatically at intervals.

For this purpose, I use the very nice tool [Lingon](http://tuppis.com/lingon/) by Peter Borg.

I've set up my script to run every 6 hours, when I am logged in.

![Lingon Remove Webpage Previews](/images/lingon-remove-webpage-previews.png)

That is it, your computer will now automatically cleanup webpage previews, and your disk won't fill up as fast :-)
