import React from "react";
import Main from "../Main";
import Sider from "../Sider";
import "./App.scss";
import Layout from "./Layout";

const App: React.FunctionComponent = () => {
  return (
    <Layout>
      <Sider />
      <Main />
    </Layout>
  );
};

export default App;
