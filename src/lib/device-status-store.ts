// File: src/lib/device-status-store.ts

let lastSeen: Date | null = null;

export function updateLastSeen() {
  lastSeen = new Date();
}

export function getLastSeen() {
  return lastSeen;
}
