import Ember from 'ember';
import { someday } from 'ember-procrastination';
import { timeout } from 'ember-concurrency';

export default Ember.Controller.extend({
  regenerateNumber: someday(function* () {
    this.set('num', Math.random());
    yield timeout(1000);
  })
});
