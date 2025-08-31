import { NextRequest } from "next/server";
import { addClient, removeClient, getRecentUpdates } from "@/lib/broadcast";

export async function GET(req: NextRequest) {
  let currentController: ReadableStreamDefaultController | null = null;
  
  const stream = new ReadableStream({
    start(controller) {
      currentController = controller;
      
      // Send recent updates on connection
      getRecentUpdates().forEach(update => {
        const data = JSON.stringify(update);
        controller.enqueue(`data: ${data}\n\n`);
      });
      
      addClient(controller);
      
      // Send keep-alive every 30s
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(`: keepalive\n\n`);
        } catch {
          clearInterval(keepAlive);
          removeClient(controller);
        }
      }, 30000);
    },
    cancel() {
      if (currentController) {
        removeClient(currentController);
      }
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

