import Observers from './observers'

export default function() {
  const observers = new Observers()

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