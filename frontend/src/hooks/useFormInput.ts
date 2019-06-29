import { useState } from 'react';

export function useFormInput(initialValue: string) {
  const [value, setValue] = useState(initialValue);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return { value, setValue, handleChange };
}
