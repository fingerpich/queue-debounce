
# Queue Debounce
Queue and debounce requests or events
it can be used to distribute events through delays

// const qd = new QueueDebounce(defaultDelay, defaultReplace)
const qd = new QueueDebounce(2000, true)

// loadQueueDebounce.add(key, callback, delay, replace)
qd.add(key, () => {
  // it will be called when its time come
})