import { useState } from 'react';

interface Props {
  inviteCode: string;
}

export function InvitePartner({ inviteCode }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = inviteCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join my PupTrack household',
        text: `Join my PupTrack household with code: ${inviteCode}`,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Invite Your Partner</h3>
      <p className="text-xs text-gray-500 mb-3">Share this code so they can join your household</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.3em] text-indigo-600">
          {inviteCode}
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleCopy}
          className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2 text-sm font-medium"
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
        <button
          onClick={handleShare}
          className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm font-medium"
        >
          Share
        </button>
      </div>
    </div>
  );
}
