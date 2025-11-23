import { ref, reactive, computed } from 'vue';
import { useWebSocket } from '@vueuse/core';

export class WebSocketClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || import.meta.env.VITE_WS_API_URL || 'ws://localhost:3002';
    this.connectionRef = ref(null);
    this.events = reactive(new Map());
    this.currentConversationId = ref(null);
  }

  connect(conversationId) {
    console.trace('WebSocket connect called from:');
    console.log('Connecting to conversation:', conversationId);

    // Close any existing connection
    if (this.connectionRef.value) {
      this.disconnect();
    }

    this.currentConversationId.value = conversationId;
    const wsUrl = `${this.baseUrl}/socket.io/?latest_event_id=-1&conversation_id=${conversationId}&EIO=4&transport=websocket`;
    console.log('connect to conversation', wsUrl);

    const { status, data, send, open, close, ws } = useWebSocket(wsUrl, {
      autoReconnect: {
        retries: 5,
        delay: 2000,
        onFailed: () => {
          console.error('Failed to reconnect WebSocket after 5 retries');
        }
      },
      onConnected: () => {
        this._emitEvent('connected', { conversationId });
      },
      onDisconnected: (_, event) => {
        this._emitEvent('disconnected', { conversationId, event });
      },
      onError: (_, event) => {
        this._emitEvent('error', { conversationId, event });
      },
      onMessage: (_, event) => {
        try {
          console.log('onMessage', event.data);
          this._emitEvent('message', event.data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          this._emitEvent('error', { error, data: event.data });
        }
      }
    });

    this.connectionRef.value = {
      status,
      data,
      send: (message) => {
        // Automatically stringify objects
        const payload = typeof message === 'object'
          ? JSON.stringify(message)
          : message;
        return send(payload);
      },
      close,
      open,
      ws
    };

    return this.connectionRef.value;
  }

  disconnect() {
    if (this.connectionRef.value) {
      this.connectionRef.value.close();
      this.connectionRef.value = null;
      this.currentConversationId.value = null;
    }
  }

  isConnected() {
    return this.connectionRef.value?.status.value === 'OPEN';
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    this.events.get(eventName).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.events.get(eventName);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  off(eventName, callback) {
    if (this.events.has(eventName)) {
      if (callback) {
        const callbacks = this.events.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      } else {
        // Remove all callbacks for this event
        this.events.delete(eventName);
      }
    }
  }

  send(message) {
    if (!this.isConnected()) {
      console.error('Cannot send message: WebSocket is not connected');
      return false;
    }

    return this.connectionRef.value.send(message);
  }

  _emitEvent(eventName, data) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventName} event handler:`, error);
        }
      });
    }
  }
}

// Create a singleton instance
const wsClient = new WebSocketClient();
export default wsClient;