---
title: Which JS test framework?
layout: post
---

## Which JS test framework?

Recently, I received a direct message on the Codebar Slack:

> Hi Morgan, I’m a budding javascript developer in The Berlin area and got reintroduced to TDD, through Jest, last night at my first Codebar event. I just noticed you posted something about testing, so I wanted to ask your opinion on Jest vs Mocha, since I got some exposure to Jest last night, and a little exposure to Mocha last month. Any preference between the two, personally? And if you were just getting into JS development, like me, with the goal of doing front-end development professionally in Berlin, and wanted to focus on competency in only one of these tools, at least while learning and building confidence, which would you choose? Thanks for anything you can tell me!

Since my answer would be more detailed than just naming a favourite test framework, I thought it would be a good idea to share my answer in public. This way it may help others pick their first few steps in learning to work with tests for JavaScript.

### Disclaimer

I am one of the maintainrs of [Sinon.JS](https//sinonjs.org) and related projects like `@sinonjs/referee`, `lolex`, etc. Since those projects use Mocha, I have more experience with that over any other test framework, which affects my opinions about test frameworks.

### Terminology

In this post I will use the following terminology:

<dl>
    <dt>Test framework or just framework</dt>
    <dd>This describes the software that runs the tests and reports results. These usually come with one or more blessed assertion libraries and reporters</dd>
    <dt>Assertion library</dt>
    <dd>An assertion library is a utitlity to inspect values against an expectation. The assertions throw an `Error` with a message describing how the value failed to meet the expectation</dd>
</dl>

## Candidates

### [Jest](https://jestjs.io)

> Jest is a delightful JavaScript Testing Framework with a focus on simplicity.
> It works with projects using: Babel, TypeScript, Node, React, Angular, Vue and more!

Jest is built as open source, with corportate contributors inside Facebook. It is recommended by React. If you drink the React cool-aid, or your colleagues do, you will be exposed to Jest.

If you're going to work with React, you should take the time to get familiar with Jest.

See [getting started](https://jestjs.io/docs/en/getting-started) for Jest.

### [Mocha](https://mochajs.org)

> Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases.

Mocha has been around since sometime 2011. It remains easy to get started with, while allowing authors to write tests for nearly everything.

It is often used for testing Node based projects.

See [getting started](https://mochajs.org/#getting-started) for Mocha.

### [AVA](https://github.com/avajs/ava)

> Testing can be a drag. AVA helps you get it done. AVA is a test runner for Node.js with a concise API, detailed error output, embrace of new language features and process isolation that let you write tests more effectively. So you can ship more awesome code. 🚀



#### [tape](https://github.com/substack/tape)

> tap-producing test harness for node and browsers

