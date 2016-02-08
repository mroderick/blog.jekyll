---
title: Introducing FailFast, a JavaScript library for failure
layout: post
topics: javascript
idcomments_post_id: http://roderick.dk/blog/2010/09/02/introducing-failfast-a-javascript-library-for-failure/
---

# Introducing FailFast, a JavaScript library for failure

Tomorrow I will be attending [dConstruct 2010](http://2010.dconstruct.org/), which I am very excited about. I flew in a day early, so I could get some time to enjoy Brighton. One of the first stops has been [The Skiff](http://theskiff.org/), "a nice little place to work in the middle of Brighton".

The Skiff is indeed a very nice place: very few interruptions and very friendly people. While sitting at my visitors desk, I've managed to finally finish a little JavaScript library, that has been a very long time in the making: [FailFast](http://github.com/mroderick/FailFast). All it took was tidying up the documentation and writing the last few missing unit tests.

## The idea behind FailFast

The goal of FailFast is to help you provide immediate and visible failure.

> Failfast refers to a lightweight form of FaultTolerance, whereby an application or system service terminates itself immediately upon encountering an error. This is done upon encountering an error so serious that it is possible that the process state is corrupt or inconsistent, and immediate exit is the best way to ensure that no (more) damage is done. Common errors that cause failfast include access violations and numeric exceptions, but may also involve internal consistency checks. This is an easy way to increase the reliability and predictability of a system.

I've been working on FailFast as a library for a few years now (yeah, I know), but the ideas are far from new. These are some of the resources that have influenced me to write this little library.

* [Fail Fast by Jim Shore](http://martinfowler.com/ieeeSoftware/failFast.pdf)
* [Failfast on C2 wiki](http://www.c2.com/cgi/wiki?FailFast)
* [Fail-fast on Wikipedia](http://en.wikipedia.org/wiki/Fail-fast)

## How to use FailFast

As with most programming practices, using a library such as FailFast, you should strive keep your code expressive and must consider future maintenance of the system you're building. Just as with writing unit tests, if you go completely overboard and test everything you can possibly think of into minute detail, you will find yourself with some very _in_-flexible code that will resist your best refactoring efforts.

As a rule of thumb, I use FailFast to give precise and early feedback on failures when working with other developers (or just future-me, who thinks that past-me is somewhat retarded).

You could use it for all the public methods of a library, or even just a component of a system, where other developers might not have in-depth understanding of the underlying complexities or external dependencies. By building an abraction to an underlying system, you should also protect the users of that abstraction from the weird errors it might produce.

Let's get you started with writing (fast) failing code!

```javascript
function divide( dividend, divisor ){
    FailFast.assertNumber( dividend, 'divide: you must pass a number as the "dividend" argument' );
    FailFast.assertNumber( divisor, 'divide: you must pass a number as the "divisor" argument' );
    FailFast.assert( divisor !== 0, 'divide: cannot divide with a divisor of zero' );
    return dividend / divisor;
}

divide( "1", 2 ) // will throw exception
divide( 1, 0 ) // will throw exception
divide( 1, 2 ) // will return 0.5
```

Our `divide` function will free us from unusable error messages and long stack traces, by throwing errors whenever bad input values are being passed. If a console (like Firebug, Safari, Chrome) is available, the error will also be logged to the console.

FailFast has a number of different assertions to help us write better code:

```javascript
assert : function( exp, msg )
assertBoolean : function( exp, msg )
assertNotNull : function( exp, msg )
assertNumber : function ( exp, msg )
assertNormalNumber : function( exp, msg )
assertObject : function( exp, msg )
assertInstanceOf : function ( klass, exp, msg )
assertHasProperty : function( object, propertyName, msg )
assertString : function( exp, msg )
assertArray : function( exp, msg )
assertFunction : function( exp, msg )
```

Most of these are really just convinience wrappers for the `assert` function, but they do help make the code that uses FailFast much more expressive.

## Get involved

If you find flaws, or have ideas for improving FailFast, please fork the repository on GitHub and get involved.