import React from "react";
import "./Layout.scss";

const Layout: React.FunctionComponent = ({ children }) => {
  return <div className="layout">{children}</div>;
};

export default Layout;
