## ember-procrastination API docs

All of `ember-procrastination`'s public API is available
on the `"ember-procrastination"` module. At this time it only includes the
`someday` module, e.g.:

```js
import { timeout } from 'ember-concurrency';
import { someday } from 'ember-procrastination';

export default Component.extend({
  regenerateNumber: someday(function* () {
    this.set('num', Math.random());
    yield timeout(100);
  })
});
```

### Calling from a template

`someday`s can be bugged from the template using the `procrastinate` helper. e.g.:

```hbs
<span>
  Number is: {{num}}
</span>
<button type="button" onClick={{procrastinate regenerateNumber}}>
  Do the Thing
</button>
```

