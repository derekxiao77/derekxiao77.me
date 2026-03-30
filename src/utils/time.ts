export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(2)}km`;
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function minutesBetween(a: number, b: number): number {
  return Math.round(Math.abs(b - a) / 60000);
}

export function isToday(timestamp: number): boolean {
  const d = new Date(timestamp);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

export function getWeekKey(timestamp: number): string {
  const d = new Date(timestamp);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return start.toISOString().slice(0, 10);
}
