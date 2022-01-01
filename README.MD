
# Queue Debounce
Queue and debounce requests or events
it can be used to distribute events through delays

#### Delay options
 specifies the time it should take to do the callback on an item of queue
 
#### Replace option
if it was true it will be send to the end of the queue to be called

```js
// const qd = new QueueDebounce(defaultDelayMS, defaultReplace)
const qd = new QueueDebounce(2000, true)

// qd.add(key, callback, specificDelay, specificReplace)
qd.add(key, () => {
  // it will be called when its time come
})
```
