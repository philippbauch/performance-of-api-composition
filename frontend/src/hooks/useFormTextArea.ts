import { useState } from 'react';

export function useFormTextArea(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };
  return { value, setValue, handleChange };
}
