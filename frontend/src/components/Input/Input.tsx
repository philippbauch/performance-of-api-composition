import React from "react";
import { Label } from "../Label";
import "./Input.scss";

interface InputProps {
  disabled?: boolean;
  empty?: string;
  extra?: React.ReactNode;
  label?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
  style?: any;
  type?: string;
  value: string;
}

const Input: React.ForwardRefExoticComponent<
  InputProps & React.RefAttributes<HTMLInputElement>
> = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      disabled = false,
      empty,
      extra,
      label,
      onChange,
      onEnter,
      placeholder,
      required = false,
      style,
      type = "text",
      value
    },
    ref
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.keyCode === 13 && onEnter) {
        onEnter();
      }
    };

    return (
      <Label
        extra={extra}
        text={label}
        required={required}
        style={{ ...style }}
      >
        {!disabled ? (
          <input
            className="input"
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            ref={ref}
            type={type}
            value={value}
          />
        ) : value ? (
          <p>{value}</p>
        ) : (
          <span style={{ opacity: 0.4 }}>{empty || "No value"}</span>
        )}
      </Label>
    );
  }
);

export default Input;
