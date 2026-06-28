import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function useWebSocket(onStockUpdate) {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        client.subscribe('/topic/stock-updates', (message) => {
          const update = JSON.parse(message.body);
          onStockUpdate(update);
        });
      },
      reconnectDelay: 5000,
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, [onStockUpdate]);
}
