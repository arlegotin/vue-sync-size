import ElementSizeObserver from 'element-size-observer'

class Observers {

  static SIDE_WIDTH = 'width'
  static SIDE_HEIGHT = 'height'
  static SIDE_BOTH = 'both'

  constructor() {
    this.items = {}
  }

  extractElement(element) {
    if (!(element instanceof Element)) {
      return element?.$el
    }

    return element
  }

  add(referenceElement, observingElement, side) {
    referenceElement = this.extractElement(referenceElement)

    if (!referenceElement) {
      return
    }

    if (!this.items[referenceElement]) {

      const observer = new ElementSizeObserver({ element: referenceElement })
      const observing = {}

      observer.on(SizeObserver.EVENT_SIZE_CHANGED, () => {
        for (const someSide of observing[observingElement]) {
          if (someSide === Observers.SIDE_BOTH || someSide === Observers.SIDE_WIDTH) {
            observingElement.style.width = `${referenceElement.offsetWidth}px`
          }
          
          if (someSide === Observers.SIDE_BOTH || someSide === Observers.SIDE_HEIGHT) {
            observingElement.style.height = `${referenceElement.offsetHeight}px`
          }
        }
      })

      this.items[referenceElement] = {
        observer,
        observing,
      }
    }

    if (!this.items[referenceElement].observing[observingElement]) {
      this.items[referenceElement].observing[observingElement] = new Set()
    }

    this.items[referenceElement].observing[observingElement].add(side)
  }

  remove(referenceElement, observingElement, side) {
    referenceElement = this.extractElement(referenceElement)

    if (!referenceElement) {
      return
    }

    if (!this.items[referenceElement]?.observing) {
      return
    }

    this.items[referenceElement].observing[observingElement].delete(side)

    if (!this.items[referenceElement].observing[observingElement].size) {
      delete this.items[referenceElement].observing[observingElement]
    }

    if (!Object.keys(this.items[referenceElement].observing).length) {
      this.items[referenceElement].observer.destructor()
      this.items[referenceElement].observer = null
      this.items[referenceElement].observing = null
      delete this.items[referenceElement]
    }
  }
}

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