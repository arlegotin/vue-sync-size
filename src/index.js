import Observers from './observers'

function vue3(observers) {
  return {
    mounted: (observingElement, { value: referenceElement, arg: side = Observers.SIDE_BOTH }) => {
      observers.add(referenceElement, observingElement, side)
    },

    updated: (observingElement, { value: referenceElement, arg: side = Observers.SIDE_BOTH }) => {
      observers.add(referenceElement, observingElement, side)
    },

    beforeUnmount: (observingElement, { value: referenceElement, arg: side = Observers.SIDE_BOTH }) => {
      observers.remove(referenceElement, observingElement, side)
    },
  }
} 

function vue2(observers) {
  return {
    inserted: (observingElement, { value: referenceElement, arg: side = Observers.SIDE_BOTH }) => {
      observers.add(referenceElement, observingElement, side)
    },

    update: (observingElement, { value: referenceElement, arg: side = Observers.SIDE_BOTH }) => {
      observers.add(referenceElement, observingElement, side)
    },

    unbind: (observingElement, { value: referenceElement, arg: side = Observers.SIDE_BOTH }) => {
      observers.remove(referenceElement, observingElement, side)
    },
  }
} 

export default function({ version = 3 } = {}) {
  const observers = new Observers()

  if (version === 3) {
    return vue3(observers)
  }

  if (version === 2) {
    return vue2(observers)
  }

  throw new Error(`Unknown version "${version}"`)
}