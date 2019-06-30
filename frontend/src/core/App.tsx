import React, { useState } from "react";
import Main from "../Main";
import { Request } from "../models/Request";
import Sider from "../Sider";
import "./App.scss";
import Layout from "./Layout";

const App: React.FunctionComponent = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  return (
    <Layout>
      <Sider
        isRunning={isRunning}
        onRequests={(r: Request[]) => setRequests(r)}
        onStartRunning={() => setIsRunning(true)}
        onStopRunning={() => setIsRunning(false)}
      />
      <Main
        isRunning={isRunning}
        onReset={() => {
          setRequests([]);
        }}
        requests={requests}
      />
    </Layout>
  );
};

export default App;
