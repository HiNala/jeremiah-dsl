"use client";

import { useEffect, useState } from "react";

type VoteUpdate = {
  type: "vote" | "new_city";
  city: string;
  votes: number;
  timestamp: number;
};

export function useRealTimeVotes(onUpdate?: (update: VoteUpdate) => void) {
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<VoteUpdate | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource("/api/votes/stream");
        
        eventSource.onopen = () => {
          setConnected(true);
          console.log("Connected to vote stream");
        };

        eventSource.onmessage = (event) => {
          try {
            const update: VoteUpdate = JSON.parse(event.data);
            setLastUpdate(update);
            onUpdate?.(update);
          } catch (e) {
            console.warn("Failed to parse vote update:", e);
          }
        };

        eventSource.onerror = () => {
          setConnected(false);
          eventSource?.close();
          
          // Retry connection after 5 seconds
          retryTimeout = setTimeout(connect, 5000);
        };
      } catch (e) {
        console.warn("Failed to create EventSource:", e);
        setConnected(false);
      }
    };

    connect();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      if (eventSource) {
        eventSource.close();
      }
      setConnected(false);
    };
  }, [onUpdate]);

  return { connected, lastUpdate };
}

