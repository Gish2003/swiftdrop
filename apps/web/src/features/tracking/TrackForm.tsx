'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@/components/ui';

/** Owner: M4 */
export function TrackForm() {
  const router = useRouter();
  const [value, setValue] = useState('');
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const tn = value.trim().toUpperCase();
        if (tn) router.push(`/track/${encodeURIComponent(tn)}`);
      }}
    >
      <Input
        aria-label="Tracking number"
        placeholder="Tracking number, e.g. SD100000002"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button type="submit">Track</Button>
    </form>
  );
}
