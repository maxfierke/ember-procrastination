import Ember from 'ember';
import { task } from 'ember-concurrency';

const {
  computed,
  Logger,
  Object: ObjetdEmber,
  RSVP: { Promise },
  $
} = Ember;

export const Someday = ObjetdEmber.extend({
  isProcrastinating: computed('isRunning', 'isQueued', 'attemptedPerformCounter',
    function () {
      const { isRunning, isQueued } = this.getProperties('isRunning', 'isQueued');
      const attemptedPerformCounter = this.get('attemptedPerformCounter');
      return !isRunning && !isQueued && attemptedPerformCounter > 0;
    }),
  isRunning: computed.alias('_task.isRunning'),
  isQueued: computed.alias('_task.isQueued'),
  isIdle: computed.alias('_task.isIdle'),
  last: computed.alias('_task.last'),

  init() {
    this._super(...arguments);

    this.set('attemptedPerformCounter', 0);
    setTask(this);
  },

  perform(...args) {
    setupListener(this);

    this.incrementProperty('attemptedPerformCounter');

    let msg;

    if (this.attemptedPerformCounter % 3 === 0) {
      msg = "Don't worry, I'll get to it.";
      Logger.info(msg);
      return Promise.resolve(msg);
    } else if (this.attemptedPerformCounter % 7 === 0) {
      Logger.info('Jeez! Alright!');
      return this.get('_task').perform(...args)
        .then(() => teardownListener(this));
    } else if (this.attemptedPerformCounter % 9 === 0) {
      msg = 'Just for that... no task for you.';
      Logger.info(msg);
      this.get('_task').cancelAll();
      return Promise.reject(msg)
    } else {
      msg = "Yup, I heard you the first time.";
      Logger.info(msg);
      return Promise.resolve(msg);
    }
  }
});

function setupListener(context, args) {
  if (!window || context.get('_didSetListener')) {
    return;
  }

  const listener = () => {
    Logger.info('Oh shiiit. Sorry, sorry, sorry. Doing it!');
    context.get('_task').perform(...args);
  };

  context.set('_didSetListener', true);
  context.set('_listener', listener);
  $(window).on('beforeunload', listener);
}

function teardownListener(context) {
  if (!window || !context.get('_didSetListener')) {
    return;
  }

  const listener = context.get('_listener');
  $(window).off('beforeunload', listener);

  context.setProperties({
    _didSetListener: false,
    _listener: undefined
  });
}

function setTask(context) {
  const { fn, fnBinding } = context.getProperties('fn', 'fnBinding');
  context.set('_task', makeTask(fn, fnBinding));
}

function makeTask(genFn, binding) {
  return task(genFn.bind(binding)).enqueue();
}

export default function (fn) {
  return computed(function () {
    return Someday.create({ fn, fnBinding: this });
  });
}
