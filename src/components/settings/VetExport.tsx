import type { PottyEvent } from '../../types';

interface Props {
  events: PottyEvent[];
  dogName: string;
}

export function VetExport({ events, dogName }: Props) {
  const handleExport = () => {
    const headers = ['Date', 'Time', 'Type', 'Surface', 'Context', 'Logged By', 'Notes'];
    const rows = events.map(e => [
      new Date(e.timestamp).toLocaleDateString(),
      new Date(e.timestamp).toLocaleTimeString(),
      e.type,
      e.surface || '',
      e.context.join('; '),
      e.userName,
      e.notes || '',
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dogName.toLowerCase()}-potty-log.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-1">Vet Export</h3>
      <p className="text-xs text-gray-500 mb-3">
        Download a CSV of all logged events to share with your vet.
      </p>
      <button
        onClick={handleExport}
        disabled={events.length === 0}
        className="w-full bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-medium disabled:opacity-50"
      >
        Export {events.length} Events as CSV
      </button>
    </div>
  );
}
