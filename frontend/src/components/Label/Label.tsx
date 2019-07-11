import cx from "classnames";
import React from "react";
import Level from "../Level";
import "./Label.scss";

interface LabelProps {
  extra?: React.ReactNode;
  required?: boolean;
  style?: any;
  text: React.ReactNode | null | undefined;
}

const Label: React.FunctionComponent<LabelProps> = ({
  children,
  extra,
  required,
  style,
  text
}) => {
  return (
    <div className="label-wrapper" style={{ ...style }}>
      {text ? (
        <Level className="label">
          <label className={cx("label-text", { "is-required": required })}>
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
