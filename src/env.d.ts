/// <reference types="astro/client" />

/** The <cap-widget> custom element registered by the Cap widget script. */
interface CapWidgetElement extends HTMLElement {
  reset: () => void;
}

interface HTMLElementTagNameMap {
  "cap-widget": CapWidgetElement;
}
