const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/multiplayer';

export class MultiplayerService {
  private socket: WebSocket | null = null;
  private onMessageCallback: ((event: any) => void) | null = null;

  constructor(userId: string) {
    this.socket = new WebSocket(`${WS_BASE_URL}?userId=${userId}`);
    
    this.socket.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(JSON.parse(event.data));
      }
    };

    this.socket.onopen = () => console.log('WebSocket Connected');
    this.socket.onclose = () => console.log('WebSocket Disconnected');
    this.socket.onerror = (error) => console.error('WebSocket Error:', error);
  }

  onMessage(callback: (event: any) => void) {
    this.onMessageCallback = callback;
  }

  sendEvent(type: string, payload: any) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
