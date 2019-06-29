import classnames from "classnames";
import React from "react";
import "./Card.scss";

interface CardProps {
  onClick?: () => void;
  status?: "success" | "error" | "warning" | "info" | null;
  style?: any;
}

const Card: React.FunctionComponent<CardProps> = ({
  children,
  onClick,
  status,
  style
}) => {
  return (
    <div
      className={classnames(
        "card",
        { "is-clickable": onClick },
        { [`is-${status}`]: status }
      )}
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
      {status && <div className="card-status-bar" />}
    </div>
  );
};

export default Card;

interface CardBodyProps {
  darker?: boolean;
  padded?: boolean;
  style?: any;
}

export const CardBody: React.FunctionComponent<CardBodyProps> = ({
  children,
  darker = false,
  padded = true,
  style
}) => {
  return (
    <div
      className={classnames(
        "card-body",
        { "is-padded": padded },
        { "is-darker": darker }
      )}
      style={{ ...style }}
    >
      {children}
    </div>
  );
};

interface CardFooterProps {
  darker?: boolean;
  padded?: boolean;
}

export const CardFooter: React.FunctionComponent<CardFooterProps> = ({
  children,
  darker = false,
  padded = true
}) => {
  return (
    <div
      className={classnames(
        "card-footer",
        { "is-padded": padded },
        { "is-darker": darker }
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FunctionComponent = ({ children }) => {
  return <div className="card-header">{children}</div>;
};
