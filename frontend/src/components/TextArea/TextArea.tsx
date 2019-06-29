import React from "react";
import { Label } from "../Label";
import "./TextArea.scss";

interface TextAreaProps {
  disabled?: boolean;
  empty?: string;
  extra?: React.ReactNode;
  label?: string;
  placeholder?: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  style?: any;
  value: string;
}

const TextArea: React.ForwardRefExoticComponent<
  TextAreaProps & React.RefAttributes<HTMLTextAreaElement>
> = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      disabled = false,
      empty,
      extra,
      label,
      placeholder,
      required = false,
      onChange,
      style,
      value
    },
    ref
  ) => {
    return (
      <Label
        extra={extra}
        required={required}
        text={label}
        style={{ ...style }}
      >
        {!disabled ? (
          <textarea
            className="sprova-textarea"
            onChange={onChange}
            placeholder={placeholder}
            ref={ref}
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

export default TextArea;
