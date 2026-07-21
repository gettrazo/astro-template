/// <reference types="astro/client" />

interface Window {
  turnstile?: {
    reset: (widgetId?: string) => void;
    render: (container: string | HTMLElement, params: Record<string, unknown>) => string;
    getResponse: (widgetId?: string) => string | undefined;
    remove: (widgetId?: string) => void;
  };
}
