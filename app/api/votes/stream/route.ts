import { NextRequest } from "next/server";

type VoteUpdate = {
  type: "vote" | "new_city";
  city: string;
  votes: number;
  timestamp: number;
};

// In-memory stream for demo (replace with Redis/DB in production)
const clients = new Set<ReadableStreamDefaultController>();
const recentUpdates: VoteUpdate[] = [];

export function broadcast(update: VoteUpdate) {
  recentUpdates.push(update);
  if (recentUpdates.length > 50) recentUpdates.shift(); // Keep last 50 updates
  
  const data = JSON.stringify(update);
  clients.forEach(controller => {
    try {
      controller.enqueue(`data: ${data}\n\n`);
    } catch {
      clients.delete(controller);
    }
  });
}

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      // Send recent updates on connection
      recentUpdates.slice(-10).forEach(update => {
        const data = JSON.stringify(update);
        controller.enqueue(`data: ${data}\n\n`);
      });
      
      clients.add(controller);
      
      // Send keep-alive every 30s
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(`: keepalive\n\n`);
        } catch {
          clearInterval(keepAlive);
          clients.delete(controller);
        }
      }, 30000);
    },
    cancel() {
      clients.delete(controller);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control"
    }
  });
}

