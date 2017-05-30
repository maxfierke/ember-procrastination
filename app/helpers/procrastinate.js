import Ember from 'ember';
import { taskHelperClosure } from 'ember-procrastination/-helpers';

export function procrastinateHelper(args, hash) {
  return taskHelperClosure('perform', args, hash);
}

export default Ember.Helper.helper(procrastinateHelper);
