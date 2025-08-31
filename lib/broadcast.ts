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

export function addClient(controller: ReadableStreamDefaultController) {
  clients.add(controller);
}

export function removeClient(controller: ReadableStreamDefaultController) {
  clients.delete(controller);
}

export function getRecentUpdates() {
  return recentUpdates.slice(-10);
}

export type { VoteUpdate };
