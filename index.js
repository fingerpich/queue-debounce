
export const Delays = {
  Immediately: -2,
  GetFirst: -1,
}

export class QueueDebounce{
  defaultDelay = 1000
  defaultReplace = true
  timerHandle = undefined
  queue = []

  constructor(delay, replace) {
    this.defaultDelay = delay
    this.defaultReplace = replace
  }

  cancelTimeout() {
    clearTimeout(this.timerHandle)
    this.timerHandle = undefined  
  }
  // replace option let you postpone the request which has repeated recently
  // delay option add a delay after running it
  add(key, callback, delay, replace) {
    const {queue, defaultReplace, defaultDelay} = this
    const ind = queue.findIndex(item => item.key === key)
    const isReplacing = replace || defaultReplace
    const newItem = {key, callback, delay: (delay > 0) ? delay : defaultDelay}
    if (ind < 0) {
      queue.push(newItem)
    } else if (isReplacing) {
      queue.splice(ind, 1)
      queue.push(newItem)
      if (!ind) { 
        this.cancelTimeout() 
      }
    }
    if (queue.length === 1 && this.timerHandle) {
      this.cancelTimeout()
    }
    
    if (delay === Delays.GetFirst || delay === Delays.Immediately) {
      queue.pop()
      queue.unshift(newItem)
      this.timerHandle = setTimeout(() => { this.next() }, 1000)
    }
    else if (delay === Delays.Immediately) {
      this.next()
    }
    else if (!this.timerHandle) {
      this.timerHandle = setTimeout(() => {
        this.next()
      }, defaultDelay)
    }
  }

  next() {
    const {delay, callback} = this.queue.shift()
    this.timeoutObj = setTimeout(() => {
      if (this.queue.length) {
        this.next()
      } else {
        this.cancelTimeout()
      }
    }, delay || 0)
    return callback && callback()
  }
}