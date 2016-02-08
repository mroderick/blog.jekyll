---
title: Disable Webpage Preview Images in Safari 4 Final
layout: post
topics: safari osx
idcomments_post_id: http://roderick.dk/blog/2009/08/03/disable-webpage-preview-images-in-safari-4-final/
---

# Disable Webpage Preview Images in Safari 4 Final

I've finally managed to switch off the final remnant of the Top Sites feature in Safari 4, the automatic generation of 'Webpage Previews'

I've previously written about how to [Reclaim Disk Space From Safari 4](http://roderick.dk/blog/2009/07/02/reclaim-disk-space-from-safari-4/), where I detailed how to set up a job to cleanup the Webpage Previews cache folder.

Luckily, that exercise has now become obsolete, thanks to reports on several sites, which I can't remember.

Below are listed the Terminal commands to verify disk use and apply the changes to Safari.

## Verify size of folder

To make sure that our fix is in fact working, let's measure the current size of the folder.

```shell
$ du -h ~/Library/Caches/com.apple.Safari/Webpage\ Previews
248M    /Users/morgan/Library/Caches/com.apple.Safari/Webpage Previews
```

Then let's empty the folder

```shell
$ rm ~/Library/Caches/com.apple.Safari/Webpage\ Previews/*
```

And let's verify that the folder is indeed empty.

```shell
$ du -h ~/Library/Caches/com.apple.Safari/Webpage\ Previews
0B    /Users/morgan/Library/Caches/com.apple.Safari/Webpage Previews
```

## Apply fix

Apply the following fix to disable generation of Webpage Preview images.

```shell
$ defaults write com.apple.Safari DebugSnapshotsUpdatePolicy -int 2
```

And don't forget to restart Safari (so, I suggest you bookmark this page)

## Verify fix

Browse around to your favorite websites for awhile, and then just re-run the command to measure disk use.

```shell
$ du -h ~/Library/Caches/com.apple.Safari/Webpage\ Previews
0B    /Users/morgan/Library/Caches/com.apple.Safari/Webpage Previews
```

The fix has been applied and tested with Safari 4.0.2 on OS X Leopard.

Please report successes and failures in the comments.
