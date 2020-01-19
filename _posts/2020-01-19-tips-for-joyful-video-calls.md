---
layout: post
title: Tips for joyful video calls
date: 2020-01-19 14:50 +0000
---
# Tips for joyful video calls

A lot of my work in the last decade has been with partially or entirely distributed teams. I expect that to be the case going forwards as more and more software engineering work switches to distributed / remote teams.

To communicate with other members in the distributed team, I use video calls for:

* pair programming
* the daily standup call
* 1-1s
* the weekly leadership call
* company all hands / town hall
* catching up with friends

This is post is for sharing some things I've learned that give me a more joyful experience with video calls. Maybe some of the tips can improve your experience.

First, some tips specific to using [Zoom.us](https://zoom.us). Then some tips that apply to all video calls, when working in a distributed team.

## Zoom: screen settings

In the General tab of settings, you'll find the screen settings. These are my recommended settings.

![zoom screen settings](/images/joyful-video-calls/screen-settings.png)

### "Use dual monitors"

If you ever use more than one monitor, this setting is great. It allows you to keep one window with the feed of the participants and one window with anythign that is being share by or with you.

When you only have one screen connected, things are as if this setting was off. Set and forget. Sorted.

### Full screen settings

You'll want the two settings for full screen **turned off**. Switching between applications when Zoom is in full screen mode is confusing and frustrating. You'll end up back in the main window, not the call and will be looking for ways to switch between the zoom windows.

Just turn these off.

### "Maximize Zoom window when a participant shares their screen"

This feature makes up for the confusing full screen support. This great for calls that have any kind of screen sharing.

You'll love it. Set and forget.

### "Scale to fit shared content to Zoom window"

This is a good default for most screen sharing calls. You can always adjust the scaling in individual calls, though I rarely need to.

## Zoom: Video settings

![zoom video settings](/images/joyful-video-calls/video-settings.png)

There are few interesting things to say about the video settings.

### "Mirror my video"

Does what it says on the tin, makes it feel like you're looking into a mirror, which is how we're used to seeing ourselves.

### "Turn off my video when joining a meeting"

In my circles, it is considered good form to enter meetings with video feed turned off and only turn it on when you've settled in and are ready to be seen by the other participants.

## Zoom: Audio settings

![zoom audio settings](/images/joyful-video-calls/audio-settings.png)

### "Join audio by computer when joining a meeting"

If you're like me, and rarely dial in using your computer, you'll want to use the audio from the computer (and not some phone call). This should be on, to save you from selecting audio source every time you join a call.

### "Mute microphone when joining a meeting"

Just like "Turn off my video when joining a meeting", this setting is considered good form. Once you're ready for other participants to hear sound from your location, you can turn it on.


### "Do not prompt to join audio when joining a meeting using 3rd party audio"

This is a complement to "Join audio by computer when joining a meeting". If you're already dialed in for audio on your phone, you know what you're doing and Zoom won't get in your way.

### "Press and hold SPACE key to temporarily unmute yourself"

[Push-to-talk](https://en.wikipedia.org/wiki/Push-to-talk) should be familiar to anyone using walkie talkies or gamers that have participated in an [MMOPRG](https://en.wikipedia.org/wiki/Massively_multiplayer_online_role-playing_game), where many people are trying to have a conversation at the same time.

When muted, you can press and hold <kbd>SPACE</kbd> key to temporarily unmute yourself. In group discussions, it is often best to keep your audio input muted, until you actually want to say something.

I use this setting all the time.

## Use a good microphone

Avoid using your laptop's built-in microphone(s).

The microphones built into laptops are omnidirectional and capture a lot of backgound noise, even the echo of your voice in an otherwise silent room.

A dedicated, high quality microphone would be the gold standard, but is also unnecessary unless you spend most of your day on calls or do professional recording of voice, for podcasts, etc.

Headsets and headphones (the ones that came with your smartphone) can be good compromise. They give significant improvement of the audio for the people you're communicating with. We want to be understood, why else join the call at all?

### Microphone recommendations

* [Blue yeti](https://www.bluedesigns.com/products/yeti/) — probably the best microphone I've had the pleasure of using. These are amazing. Recommeded for when you have a dedicated desk and are willing to spend a little time to learn to use them. It is possible to configure them for multiple participants, read the manual.
* [Jabra Speak](https://www.jabra.com/business/speakerphones/jabra-speak-series) — this series of speakerphones are great for conference calls, especially if there are two or more participants in the same room. Also great, if you don't feel like wearing headphones
* Most noise cancelling headphones have good, built-in microphone for calls
* [Apple EarPods](https://www.apple.com/shop/product/MNHF2AM/A/earpods-with-35-mm-headphone-plug) — for the sound quality they provide, I think these are a great, affordable choice.

## Avoid making calls in locations with a flutter echo

Sadly, a lot of office space, meeting rooms and in-office "phone booths" have really terrible acoustic properties when it comes to understanding human voices.

One phenomenon that you often experience in these locations is a flutter echo.

> Flutter echoes result from repeated sound reflections between parallel walls with insufficient absorption; they are mostly perceived as disturbing and can noticeably impair speech intelligibility.

See [Prevention of Flutter Echoes in Architecturally Demanding Spaces
](https://download.spsc.tugraz.at/thesis/BA_Giller.pdf)

It is very easy to detect a flutter echo. Wait for a quiet moment, clap a few times with seconds between each clap. Observe how long the clap echoes in the room.

Generally, the bigger the room, the worse the flutter echo gets and speech intelligibility in worsened.

Multiple sound sources in the same room amplify this problem.

Welcome to the open office plan.

![this is fine comic](/images/joyful-video-calls/this-is-fine.jpg)

The effect of the flutter echo on speech intelligibility is even worse for somone trying to understand you through a microphone in an echoey room.

Even the best microphones cannot cope with bad acoustics. If they could, there wouldn't be an enitre industry dedicated towards building sound recording studios.

**Avoid making calls in locations with a flutter echo.**

Create or seek out locations with more human-friendly acoustics. You'll be happier and so will the participants in your call.

## Use AI noise cancelling

Someone at work introduced me to [krisp.ai](https://ref.krisp.ai/u/u0f5a22bc8?utm_source=refprogram&utm_campaign=41297&locale=en-GB), which is a great little application that runs on your computer and filters out noise in audio streams in real time.

The results are truly impressive: people in my calls rarely notice the street noise invading the co-working space or the occasional ambulance passing by.

krips doesn't do well with flutter echoes of voices, so the above recommendation still stands: avoid flutter echoes.

krisp can even do noise cancelling on the input stream from the remote end.

[Sign up for a free trial of krisp using my link](https://ref.krisp.ai/u/u0f5a22bc8?utm_source=refprogram&utm_campaign=41297&locale=en-GB), and we both get extension on our free trials :)
