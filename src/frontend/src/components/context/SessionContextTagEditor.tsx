import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { getSessionContext, setSessionContext, type ContextTag } from '../../usage/storage/localEventStore';

const contextOptions: { value: ContextTag; label: string }[] = [
  { value: 'Study', label: 'Study' },
  { value: 'Work', label: 'Work' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Idle', label: 'Idle' },
  { value: 'Custom', label: 'Custom' },
];

export default function SessionContextTagEditor() {
  const [context, setContext] = useState<ContextTag>(getSessionContext());

  useEffect(() => {
    const interval = setInterval(() => {
      setContext(getSessionContext());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (value: ContextTag) => {
    setSessionContext(value);
    setContext(value);
  };

  return (
    <Select value={context} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px] h-9">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {contextOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
