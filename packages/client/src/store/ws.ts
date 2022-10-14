export type WSEventCallback = {
  message: (data: { type: string; body: Record<string, any> }) => void;
  error: (event: Event) => void;
  open: (event: Event) => void;
  close: (event: Event) => void;
};

type WSListeners = {
  [E in keyof WSEventCallback]: WSEventCallback[E][];
};

class WS {
  private instance: WebSocket | null = null;

  private listeners: WSListeners = {
    message: [],
    error: [],
    open: [],
    close: [],
  };

  private assignListeners() {
    if (this.instance) {
      this.instance.onopen = (e) => this.emit("open", e);
      this.instance.onerror = (e) => this.emit("error", e);
      this.instance.onmessage = (e) => {
        this.emit("message", JSON.parse(e.data));
      };
      this.instance.onclose = (e) => this.emit("close", e);
    }
  }

  connect() {
    if (!this.instance || this.instance.CLOSED || this.instance.CONNECTING) {
      this.instance = new WebSocket("ws://localhost:7000");
      this.assignListeners();
    }
  }

  on<E extends keyof WSEventCallback>(event: E, callback: WSEventCallback[E]) {
    if (typeof window === "undefined") return;
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off<E extends keyof WSEventCallback>(event: E, callback: WSEventCallback[E]) {
    if (typeof window === "undefined") return;
    // @ts-ignore
    this.listeners[event] = this.listeners[event].filter(
      (_callback) => _callback !== callback
    );
  }

  emit<E extends keyof WSEventCallback>(
    event: E,
    ...data: Parameters<WSEventCallback[E]>
  ) {
    this.listeners[event].forEach((callback) => {
      // @ts-ignore
      callback.apply(null, data);
    });
  }
}

export const ws = new WS();
