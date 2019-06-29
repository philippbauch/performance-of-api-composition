import classnames from "classnames";
import React from "react";
import "./Level.scss";

interface Props {
  align?: "top" | "center" | "bottom";
  className?: string;
  style?: any;
}

const Level: React.FunctionComponent<Props> = ({
  align = "center",
  children,
  className,
  style
}) => {
  return (
    <div
      className={classnames(
        className,
        "sprova-level",
        { "align-top": align === "top" },
        { "align-center": align === "center" },
        { "align-bottom": align === "bottom" }
      )}
      style={{ ...style }}
    >
      {children}
    </div>
  );
};

export default Level;
