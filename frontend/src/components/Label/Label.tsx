import cx from "classnames";
import React from "react";
import Level from "../Level";
import "./Label.scss";

interface LabelProps {
  extra?: React.ReactNode;
  required?: boolean;
  style?: any;
  text: string | null | undefined;
}

const Label: React.FunctionComponent<LabelProps> = ({
  children,
  extra,
  required,
  style,
  text
}) => {
  return (
    <div className="sprova-label-wrapper" style={{ ...style }}>
      {text ? (
        <Level className="sprova-label">
          <label
            className={cx("sprova-label-text", { "is-required": required })}
          >
            {text}
          </label>
          {extra}
        </Level>
      ) : null}
      {children}
    </div>
  );
};

export default Label;
