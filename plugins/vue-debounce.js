// import { vue3Debounce } from 'vue-debounce'

// export default defineNuxtPlugin((nuxtApp) => {
//   nuxtApp.vueApp
//     .directive('debounce', { ...vue3Debounce(), getSSRProps: () =>({}) })
// })



// The above code should work, but it doesn't because of ESM modules something
// I think vue-debounce would need to be slightly rebuilt, and ain't nobody got time for that
// so I pulled the relevant bits from https://github.com/dhershman1/vue-debounce manually
function convertTime (time) {
  const [amt, t = 'ms'] = String(time).split(/(ms|s)/i)
  const types = {
    ms: 1,
    s: 1000
  }

  return Number(amt) * types[t]
}

function debounce (fn, wait) {
  let timeout = null
  const timer = typeof wait === 'number' ? wait : convertTime(wait)

  const debounced = function (...args) {
    const later = () => {
      timeout = null

      fn.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, timer)

    if (!timeout) {
      fn.apply(this, args)
    }
  }

  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}

// Helper Functions
/**
 * Maps through an array of strings and lowercases all of them
 * @param {Array} list an array of strings to map through
 */
function toLowerMap (list) {
  return list.map(x => x.toLowerCase())
}

/**
 * Takes in a value and ensures its wrapped within an array
 * @param {Any} value The value to ensure is an array
 */
function ensureArray (value) {
  if (Array.isArray(value)) {
    return value
  }

  if (value == null) {
    return []
  }

  return [value]
}

// Figures out the event we are using with the bound element
function mapOutListeningEvents (attrs, listenTo) {
  // Make sure attributes exist on the element
  const elEvents = attrs ? attrs['debounce-events'] : []
  // If they set an events attribute that overwrites everything
  if (elEvents && elEvents.length > 0) {
    // Since they can send in an array or a string we need to be prepared for both
    if (Array.isArray(elEvents)) {
      return toLowerMap(elEvents)
    }
    return toLowerMap(elEvents.split(','))
  }

  return toLowerMap(ensureArray(listenTo))
}

function isEmpty (str) {
  return str === ''
}

function isLocked (key, modifiers) {
  return key === 'Enter' && (!modifiers.lock || modifiers.unlock)
}

function shouldFireOnEmpty (value, key, modifiers) {
  return isEmpty(value) && modifiers.fireonempty && (key === 'Enter' || key === ' ')
}


const directive = function ({
  lock = false,
  listenTo = 'keyup',
  defaultTime = '300ms',
  fireOnEmpty = false,
  cancelOnEmpty = false,
  trim = false
} = {}) {
  return {
    created (el, {
      value: debouncedFn,
      arg: timer = defaultTime,
      modifiers
    }, vnode) {
      const combinedRules = Object.assign({
        lock,
        trim,
        fireonempty: fireOnEmpty,
        cancelonempty: cancelOnEmpty
      }, modifiers)
      const events = mapOutListeningEvents(vnode.props, listenTo)
      const fn = debounce(e => {
        debouncedFn(e.target.value, e)
      }, timer)

      function handler (event) {
        const value = combinedRules.trim ? event.target.value.trim() : event.target.value

        if (isEmpty(value) && combinedRules.cancelonempty) {
          fn.cancel()
        } else if (isLocked(event.key, combinedRules) || shouldFireOnEmpty(value, event.key, combinedRules)) {
          fn.cancel()
          debouncedFn(event.target.value, event)
        } else {
          fn(event)
        }
      }

      events.forEach(e => {
        el.addEventListener(e, handler)
      })
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp
    .directive('debounce', { ...directive(), getSSRProps: () =>({}) })
})
