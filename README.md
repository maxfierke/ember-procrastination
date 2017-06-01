# ember-procrastination

Did you know that almost no language implements procrastination primitives? Of
course, Java offers a `ProcrastinationFactory`, .NET has `System.Enterprise.ProcrastinationServices` and Haskell has that powerful `Procrastinate` monad. However, to date no one has
ever implemented anything like this for Ember or JavaScript. Sad.

## Overview

ember-procrastination introduces a new concurrency primitive called a `someday`.
A `someday` is a lot like a `task` from ember-concurrency, but has the special
property that it will only schedule and do work when prompted several times.
This means that only work the user truly wants done will get completed. But be
careful: if you ask too much, it may get mad and cancel work already in-progress.
Such truly concurrent code can be finicky.

ember-procrastination also leverages the best in lazy code loading technology to
ensure that we don’t execute expensive operations until the last possible moment.
To do this, ember-procrastination uses an advanced Just-In-Time (JIT) feature
present in modern JavaScript: the `beforeunload` event. When ember-procrastination
detects this event, all code that has been previously prompted to run that has
not yet been run will run, ensuring that all work is completed. And it all
happens concurrently. Amazing.

## Installation

```
$ ember install ember-procrastination
```

## Example

controller.js:
```
import Ember from 'ember';
import { someday } from 'ember-procrastination';
import { timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  regenerateNumber: someday(function* () {
    this.set('num', Math.random());
    yield timeout(1000);
  })
});
```

template.hbs
```
<span>
  Number is: {{num}}
</span>
<pre>
  state = {{regenerateNumber.state}}
  lastExcuse = {{regenerateNumber.lastExcuse}}
</pre>
<br />
<button
  type="button"
  disabled={{regenerateNumber.isRunning}}
  onClick={{procrastinate regenerateNumber}}>
  {{#if (and regenerateNumber.isProcrastinating regenerateNumber.lastExcuse)}}
    {{regenerateNumber.lastExcuse}}
  {{else if regenerateNumber.isRunning}}
    Doing the thing...
  {{else if regenerateNumber.isQueued}}
    Ugh... Why do you keep asking me to do stuff?
  {{else}}
    Do the Thing
  {{/if}}
</button>
```

## Developing

* `git clone <repository-url>` this repository
* `cd ember-procrastination`
* `npm install`

### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
