
export const Delays = {
  Immediately: -2,
  GetFirst: -1,
}

interface QueueItem {
  key: String | number, 
  callback: Function, 
  delay: number
}

export class QueueDebounce{
  defaultDelay: number = 1000
  defaultReplace: boolean = true
  timerHandle: any = undefined
  queue: QueueItem[] = []

  constructor(delay: number = 1000, replace: boolean = false) {
    this.defaultDelay = delay
    this.defaultReplace = replace
  }

  cancelTimeout() {
    clearTimeout(this.timerHandle)
    this.timerHandle = undefined  
  }
  // replace option let you postpone the request which has repeated recently
  // delay option add a delay after running it
  add(key: String | number, callback: Function, delay:number = 0, replace?: Boolean) {
    const {queue, defaultReplace, defaultDelay} = this
    const ind = queue.findIndex(item => item.key === key)
    replace = typeof replace !== 'undefined' ? replace : defaultReplace
    delay = (delay > 0) ? delay : defaultDelay
    const newItem = {key, callback, delay}
    if (ind < 0) {
      queue.push(newItem)
    } else if (replace) {
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
    this.timerHandle = setTimeout(() => {
      if (this.queue.length) {
        this.next()
      } else {
        this.cancelTimeout()
      }
    }, delay || 0)
    return callback && callback()
  }
}