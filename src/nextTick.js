
const callbacks = []
let pending = false

function nextTick (cb) {
  callbacks.push(cb)

  if (!pending) {
    pending = true
    setTimeout(flushCallbacks, 0)
  }
}

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let has = {}
let queue = []
let waiting = false

function flushSchedulerQueue () {
  var watcher, id
  for (let i = 0; i < queue.length; i++) {
    watcher = queue[i]
    id = watcher.id
    has[id] = null
    watcher.run()
  }
  waiting = false
}

function queueWatcher (watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    queue.push(watcher)
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}

export {
  nextTick,
  queueWatcher
}