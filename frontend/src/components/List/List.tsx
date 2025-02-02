import classnames from "classnames";
import React from "react";
import "./List.scss";

interface Props {
  data: any[];
  empty?: React.ReactNode;
  onItemClick?: (item: any) => void;
  renderItem: (item: any, index: number) => React.ReactNode;
  small?: boolean;
  style?: any;
  zebra?: boolean;
}

const List: React.FunctionComponent<Props> = ({
  data,
  empty,
  onItemClick,
  renderItem,
  small = false,
  style,
  zebra = false
}) => {
  return (
    <div className="list" style={{ ...style }}>
      {data.length > 0 ? (
        <ul className={classnames("list-items")}>
          {data.map((item: any, index: number) => (
            <li
              key={index}
              className={classnames(
                "list-item",
                { "is-small": small },
                { "is-clickable": onItemClick },
                { "is-zebra": zebra }
              )}
              onClick={() => onItemClick && onItemClick(item)}
              style={{ width: "100%" }}
            >
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      ) : (
        <div className={classnames("list-empty")}>
          {empty || (
            <span className={classnames("list-empty-item")}>No data.</span>
          )}
        </div>
      )}
    </div>
  );
};

export default List;
