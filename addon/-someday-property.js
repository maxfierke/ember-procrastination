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
  isProcrastinating: computed('isRunning', 'isQueued', 'performCount',
    function () {
      const { isRunning, isQueued } = this.getProperties('isRunning', 'isQueued');
      const performCount = this.get('performCount');
      return !isRunning && !isQueued && performCount > 0;
    }),
  isRunning: computed.alias('_task.isRunning'),
  isQueued: computed.alias('_task.isQueued'),
  isIdle: computed.alias('_task.isIdle'),
  last: computed.alias('_task.last'),
  state: computed('_task.state', function () {
    if (this.get('isProcrastinating')) {
      return 'procrastinating';
    } else {
      return this.get('_task.state');
    }
  }),

  init() {
    this._super(...arguments);

    this.set('performCount', 0);
    setTask(this);
  },

  perform(...args) {
    setupListener(this, ...args);

    this.incrementProperty('performCount');
    const performCount = this.get('performCount');

    let excuse;

    if (performCount % 3 === 0) {
      excuse = "Don't worry, I'll get to it.";
    } else if (performCount % 7 === 0) {
      setExcuse(this, 'Jeez! Alright!');
      return this.get('_task').perform(...args)
        .then(() => {
          teardownListener(this);
          setExcuse(this, undefined);
        });
    } else if (performCount % 9 === 0) {
      excuse = 'Just for that... no task for you.';
      setExcuse(this, excuse);
      this.get('_task').cancelAll();
      return Promise.reject(excuse);
    } else {
      excuse = "Yup, I heard you the first time.";
    }

    setExcuse(this, excuse);
    return Promise.resolve(excuse);
  }
});

function setupListener(context, ...args) {
  if (!window || context.get('_didSetListener')) {
    return;
  }

  const listener = (e) => {
    const excuse = 'Oh shiiit. Sorry, sorry, sorry. Doing it!';
    setExcuse(context, excuse);
    e.returnValue = excuse;
    context.get('_task').perform(...args).then(() => setExcuse(context, undefined));
    return excuse;
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
  const { fn, fnContext } = context.getProperties('fn', 'fnContext');
  context.set('_task', makeTask(fn, fnContext));
}

function setExcuse(context, excuse) {
  if (excuse) {
    Logger.debug(excuse);
  }
  context.set('lastExcuse', excuse);
}

function makeTask(genFn, binding) {
  return task(genFn.bind(binding)).enqueue();
}

export function SomedayProperty(fn) {
  return computed(function () {
    const fnContext = this;
    return Someday.create({ fn, fnContext });
  });
}
