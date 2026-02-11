import { Button } from '../../components/ui/button';
import { saveLocalEvent, getSessionContext } from '../storage/localEventStore';
import type { LocalEvent } from '../events/types';
import type { ComponentProps } from 'react';

interface TrackedButtonProps extends ComponentProps<typeof Button> {
  trackingLabel?: string;
}

export default function TrackedButton({ trackingLabel, onClick, ...props }: TrackedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const event: LocalEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      eventType: 'button_click',
      context: getSessionContext(),
      tags: ['interaction', trackingLabel || 'button'],
      source: 'app',
      synced: false,
    };
    saveLocalEvent(event);

    if (onClick) {
      onClick(e);
    }
  };

  return <Button onClick={handleClick} {...props} />;
}
