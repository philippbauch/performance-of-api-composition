import classnames from "classnames";
import React from "react";
import "./Table.scss";

interface TableColumnProps {
  style?: any;
}

export const TableColumn: React.FunctionComponent<TableColumnProps> = ({
  children,
  style
}) => {
  return (
    <td className={classnames("sprova-table-column")} style={{ ...style }}>
      {children}
    </td>
  );
};

interface TableRowProps {
  onClick?: (item: any) => void;
  style?: any;
}

export const TableRow: React.FunctionComponent<TableRowProps> = ({
  children,
  onClick,
  style
}) => {
  return (
    <tr
      className={classnames("sprova-table-row", {
        "is-clickable": onClick
      })}
      onClick={onClick}
      style={{ ...style }}
    >
      {children}
    </tr>
  );
};

interface TableProps {
  columnTitles: string[];
  data: any[];
  empty?: React.ReactNode;
  renderRow: (item: any, index: number) => React.ReactNode;
  style?: any;
}

const Table: React.FunctionComponent<TableProps> = ({
  columnTitles,
  data,
  empty,
  renderRow,
  style
}) => {
  return data && data.length > 0 ? (
    <table className="sprova-table" style={{ ...style }}>
      <thead className="sprova-table-head">
        <TableRow>
          {columnTitles.map((column: string, index: number) => (
            <th key={index}>{column}</th>
          ))}
        </TableRow>
      </thead>
      <tbody className="sprova-table-body">
        {data.map((item: any, index: number) => renderRow(item, index))}
      </tbody>
    </table>
  ) : (
    <div className={classnames("sprova-table-empty")}>
      {empty || (
        <span className={classnames("sprova-table-empty-item")}>No data.</span>
      )}
    </div>
  );
};

export default Table;
