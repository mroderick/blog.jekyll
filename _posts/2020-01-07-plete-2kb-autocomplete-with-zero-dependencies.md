---
layout: post
title: 'plete: 2KB autocomplete with zero dependencies'
date: 2020-01-07 21:43 +0000
---
## plete: 2KB autocomplete with zero dependencies

For a project at work, we needed an autocomplete component, that meets the following criteria:

1. zero dependencies
2. decent WAI-ARIA / accessibility support
3. reasonable license
4. good test coverage
5. remote filtering
6. custom rendering of options
7. separation of presentation from the value selected

I am a firm believer in open web standards. Whenever feasible, I prefer to [apply lean web principles and leverage the full feature set of the web platform](https://leanweb.dev).

While there is a [`<datalist>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) in the HTML Living Standard spec, it is not up to par for the requirements listed above.

The first four requirements are easily met by `<datalist>`, as it's native to the platform. However, the last three requirements cannot be met by `<datalist>`, so it is not relevant for my application.

[Lea Verou came to similar conclusions](http://lea.verou.me/2015/02/awesomplete-2kb-autocomplete-with-zero-dependencies/), and created [`Awesomeplete`](http://leaverou.github.io/awesomplete/), which has been a great inspiration.

The remote filtering requirement is unavoidable. For our project, the autocomplete component will have to filter multiple datasets, each having more than 30,000 entries. These datasets are expected to grow. There simply is no _responsible_ way to send that much data to the client to be used in a `<datalist>` element.

I spent some time surveying the autocomplete component landscape as of late 2019, hoping to find a suitable component. None was found.

For a few days, I considered contributing async/remote filtering to [`Awesomeplete`](http://leaverou.github.io/awesomplete/), but thought it would be too invasive. I also considered contributing accessiblity improvements and test coverage to other candidates, but decided against it.

Like Lea, I eventually came to the conclusion that the best path forwards, would be write my own autocomplete component.

I give you [`plete`](https://plete.dev), "a vanilla js autocomplete component that supports remote filtering."

Documentation at [https://plete.dev](https://plete.dev).
