---
title: Code Retreat Berlin
layout: post
topics: javascript
idcomments_post_id: http://roderick.dk/blog/2011/07/10/code-retreat-berlin/
---

# Code Retreat Berlin

On Saturday 2011-07-09 I attended [Code Retreat Berlin](coderetreat-berlin.de/), these are my notes.

For those that have not been to or heard of code retreats, let me just quickly sketch out the concept. A code retreat is a place where programmers can practice their craft and improve their collaborative skills. Just like musicians need to practice, so do programmers.

The day is divided up into six sessions of 45 minutes with a little retrospective break in between, and of course a lunch break. During the sessions you pair up with another programmer, and do pair programming, working on [Conway's Game of Life](http://www.conwaylife.com/wiki/Conway's_Game_of_Life). Not surprisingly, the sessions were over much too quickly, just as the going was getting good.

At the end of every session, you delete the code, and only keep the learnings.

## Sessions

The instructor suggested that we move out of our comfort zones and try new languages. I felt that the important learnings would come from practicing TDD and Pairing, not trying to get a new language to run on my computer, or trying to understand the syntax of the code that the driving partner was writing.

I can learn new languages and stumble around on my own, or with a dedicated guide in other contexts, so I was quite happy to work with JavaScript at every session.

I had pairing sessions with @szafranek, 'Daniel', 'Constantin' and @til. In one session, we didn't write one line of code, but spent our time discussing implementation strategies. In another session, I gave an introduction to the finer points of JavaScript, using Conway's Game of Life as a vehichle for good examples.

At the very last session, @til and I put together all the pieces I had on my comptuer (not taking direction well, I stashed the code after each session) and made a **working** implementation of Conway's Game of Life. It was very satisfying to have something that's actually working, just like a musician, I like to play the entire thing and not just practice scales all day.

## My learnings

These are some of my learnings from pairing with others at the retreat

* Pairing, when succesful, is very efficient and makes for high quality code
* The driver of the pair needs to communicate what he's doing at all times, a bit like thinking out loud. Ex: "I will validate the input of this function" or "just making sure that null values won't break the program".
* The navigator needs to have the bigger picture, and should communicate where the pair is going, and of course point out typos and small mistakes. Ex: "You'll need a function to determine how many neighbours a cell has" or "you can isolate that chunk into it's own function".
* TDD is _still_ very good for making high quality code
* TDD _still_ won't help you if you don't know where you're going. Writing tests first will not fix the problem of not knowing exactly what you need to do. Spend time on understanding the problem, do reseearch online, read books. This is not really possible during a code retreat, which is why Conway's Game of Life is a good problem to work on.

## Wrap up

Code Retreat Berlin was a great experience. For me there is great joy in understanding problems and creating elegant solutions to them. The format of a code retreat feels contradictory to my urge to *finish* what I am working on, but after a while, you get used to it, and you can focus on practicing.

One thing I would like to see different in future code retreats is some Venn diagram posted on a wall or website, suggesting pairing partners based on proficiency with programming languages.