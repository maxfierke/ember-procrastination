import Ember from 'ember';
import { Someday } from 'ember-procrastination/-someday-property';

export function taskHelperClosure(taskMethod, _args, hash) {
  let someday = _args[0];
  let outerArgs = _args.slice(1);

  return Ember.run.bind(null, function (...innerArgs) {
    if (!(someday instanceof Someday)) {
      Ember.assert(`The first argument passed to the \`procrastination\` helper should be a Someday object (without quotes); you passed ${someday}`, false);
      return;
    }

    if (hash && hash.value) {
      let event = innerArgs.pop();
      innerArgs.push(Ember.get(event, hash.value));
    }

    return someday[taskMethod](...outerArgs, ...innerArgs);
  });
}
