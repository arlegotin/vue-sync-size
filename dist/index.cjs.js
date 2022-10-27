'use strict';

var EventEmitter = require('events');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

class ElementSizeObserver extends EventEmitter__default["default"] {
  /**
   * @typedef {String} SizeObserverEventName
   */
  static EVENT_SIZE_CHANGED = 'resize';

  /**
   * @param {Object} params
   * @param {Element} params.element – observable DOM-element
   * @param {Function|null}
   */
  constructor({
    element,
    onResize = null
  }) {
    super();
    this.element = element;
    this.observer = new ResizeObserver(this.onObserverChanged.bind(this));
    if (onResize) {
      this.on(ElementSizeObserver.EVENT_SIZE_CHANGED, onResize);
    }
    this.observer.observe(this.element);
  }

  /**
   * Destroys the instance
   * @returns {void}
   */
  destructor() {
    this.removeAllListeners();
    this.observer.unobserve(this.element);
    this.observer.disconnect();
  }

  /**
   * Processes list of entries
   * @param {Array.<ResizeObserverEntry>} entries 
   * @returns {void}
   */
  onObserverChanged(entries) {
    const entry = entries.find(e => e.target === this.element);
    if (entry) {
      this.emit(ElementSizeObserver.EVENT_SIZE_CHANGED, {
        element: this.element
      });
    }
  }
}

class Observers {
  static SIDE_WIDTH = 'width';
  static SIDE_HEIGHT = 'height';
  static SIDE_BOTH = 'both';
  constructor() {
    this.items = {};
  }
  extractElement(element) {
    if (!(element instanceof Element)) {
      return element?.$el;
    }
    return element;
  }
  add(referenceElement, observingElement, side) {
    referenceElement = this.extractElement(referenceElement);
    if (!referenceElement) {
      return;
    }
    if (!this.items[referenceElement]) {
      const observer = new ElementSizeObserver({
        element: referenceElement
      });
      const observing = {};
      observer.on(SizeObserver.EVENT_SIZE_CHANGED, () => {
        for (const someSide of observing[observingElement]) {
          if (someSide === Observers.SIDE_BOTH || someSide === Observers.SIDE_WIDTH) {
            observingElement.style.width = `${referenceElement.offsetWidth}px`;
          }
          if (someSide === Observers.SIDE_BOTH || someSide === Observers.SIDE_HEIGHT) {
            observingElement.style.height = `${referenceElement.offsetHeight}px`;
          }
        }
      });
      this.items[referenceElement] = {
        observer,
        observing
      };
    }
    if (!this.items[referenceElement].observing[observingElement]) {
      this.items[referenceElement].observing[observingElement] = new Set();
    }
    this.items[referenceElement].observing[observingElement].add(side);
  }
  remove(referenceElement, observingElement, side) {
    referenceElement = this.extractElement(referenceElement);
    if (!referenceElement) {
      return;
    }
    if (!this.items[referenceElement]?.observing) {
      return;
    }
    this.items[referenceElement].observing[observingElement].delete(side);
    if (!this.items[referenceElement].observing[observingElement].size) {
      delete this.items[referenceElement].observing[observingElement];
    }
    if (!Object.keys(this.items[referenceElement].observing).length) {
      this.items[referenceElement].observer.destructor();
      this.items[referenceElement].observer = null;
      this.items[referenceElement].observing = null;
      delete this.items[referenceElement];
    }
  }
}

function vue3(observers) {
  return {
    mounted: (observingElement, {
      value: referenceElement,
      arg: side = Observers.SIDE_BOTH
    }) => {
      observers.add(referenceElement, observingElement, side);
    },
    updated: (observingElement, {
      value: referenceElement,
      arg: side = Observers.SIDE_BOTH
    }) => {
      observers.add(referenceElement, observingElement, side);
    },
    beforeUnmount: (observingElement, {
      value: referenceElement,
      arg: side = Observers.SIDE_BOTH
    }) => {
      observers.remove(referenceElement, observingElement, side);
    }
  };
}
function vue2(observers) {
  return {
    inserted: (observingElement, {
      value: referenceElement,
      arg: side = Observers.SIDE_BOTH
    }) => {
      observers.add(referenceElement, observingElement, side);
    },
    update: (observingElement, {
      value: referenceElement,
      arg: side = Observers.SIDE_BOTH
    }) => {
      observers.add(referenceElement, observingElement, side);
    },
    unbind: (observingElement, {
      value: referenceElement,
      arg: side = Observers.SIDE_BOTH
    }) => {
      observers.remove(referenceElement, observingElement, side);
    }
  };
}
function index ({
  version = 3
} = {}) {
  const observers = new Observers();
  if (version === 3) {
    return vue3(observers);
  }
  if (version === 2) {
    return vue2(observers);
  }
  throw new Error(`Unknown version "${version}"`);
}

module.exports = index;
