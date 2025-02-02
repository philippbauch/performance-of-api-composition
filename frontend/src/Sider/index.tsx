import { Button, Icon, Progress, Select, Spin, Switch, Tooltip } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import grpcAgent from "../api/grpc.agent";
import restAgent from "../api/rest.agent";
import Card, { CardBody, CardHeader } from "../components/Card";
import Input from "../components/Input";
import { Label } from "../components/Label";
import Level from "../components/Level";
import TextArea from "../components/TextArea";
import { useFormInput } from "../hooks/useFormInput";
import { useFormTextArea } from "../hooks/useFormTextArea";
import { Protocol } from "../models/Protocol";
import { Query } from "../models/Query";
import { Request } from "../models/Request";
import "./index.scss";
import { GraphQLClient } from "graphql-request";

const Option = Select.Option;

interface Props {
  isRunning: boolean;
  onRequests: (requests: Request[]) => void;
  onStartRunning: () => void;
  onStopRunning: () => void;
}

function sleep(ms: number) {
  return new Promise((resolve: any) => setTimeout(resolve, ms));
}

const Sider: React.FunctionComponent<Props> = ({
  isRunning,
  onRequests,
  onStartRunning,
  onStopRunning
}) => {
  const {
    value: amount,
    setValue: setAmount,
    handleChange: handleAmountChange
  } = useFormInput("10");
  const [currentProtocol, setCurrentProtocol] = useState<Protocol>(
    Protocol.REST
  );
  const [currentQueryId, setCurrentQueryId] = useState<number>(-1);
  const [progress, setProgress] = useState<number>(0);
  const [queries, setQueries] = useState<Query[]>([]);
  const {
    value: queryContent,
    setValue: setQueryContent,
    handleChange: handleQueryContentChange
  } = useFormTextArea("");
  const {
    value: queryTitle,
    setValue: setQueryTitle,
    handleChange: handleQueryTitleChange
  } = useFormInput("");

  const handleProtocolChange = (protocol: number) => {
    if (protocol === currentProtocol) {
      return;
    }
    setCurrentProtocol(protocol);
  };

  const handleQueryChange = (queryId: number) => {
    if (queryId === currentQueryId) {
      return;
    } else if (queryId >= 0) {
      setCurrentQueryId(queryId);
      const query = queries[queryId];
      setQueryContent(query.content);
      setQueryTitle(query.title);
    } else {
      setCurrentQueryId(-1);
      setQueryContent("");
      setQueryTitle("");
    }
  };

  const removeQuery = () => {
    const queryToRemove = queries[currentQueryId];
    const queriesWithout = _.without(queries, queryToRemove);
    const queriesStringified = JSON.stringify({
      queries: queriesWithout
    });
    localStorage.setItem("queries", queriesStringified);
    setQueries(queriesWithout);
    resetQuery();
  };

  const resetQuery = () => {
    setAmount("10");
    setCurrentProtocol(Protocol.REST);
    setCurrentQueryId(-1);
    setQueryContent("");
    setQueryTitle("");
  };

  const chooseClient = (): GraphQLClient => {
    return currentProtocol === Protocol.REST ? restAgent : grpcAgent;
  };

  const runQuery = async () => {
    onStartRunning();
    const client: GraphQLClient = chooseClient();
    const requests: Request[] = [];
    for (let id = 0; id < Number(amount); id++) {
      const timestamp = Date.now();
      const partialRequest = {
        id,
        timestamp,
        protocol: currentProtocol
      };
      try {
        const { extensions } = await client.rawRequest(queryContent);
        requests.push({
          ...partialRequest,
          ok: true,
          duration: (extensions && extensions.tracing.duration) || 0
        });
      } catch (error) {
        requests.push({
          ...partialRequest,
          ok: false,
          duration: 0
        });
      }
      setProgress(((id + 1) / Number(amount)) * 100);
    }
    onRequests(requests);
    onStopRunning();
    setProgress(0);
  };

  const saveQuery = () => {
    const query: Query = {
      title: queryTitle,
      content: queryContent
    };
    const queriesWith = [...queries, query];
    const queriesStringified = JSON.stringify({
      queries: queriesWith
    });
    localStorage.setItem("queries", queriesStringified);
    setQueries(queriesWith);
    setCurrentQueryId(queriesWith.length - 1);
  };

  useEffect(() => {
    const queriesStringified = localStorage.getItem("queries");
    if (!queriesStringified) {
      return;
    }
    const { queries: savedQueries } = JSON.parse(queriesStringified);
    setQueries(savedQueries);
  }, []);

  return (
    <div className="sider">
      <Card>
        <CardHeader>
          <h4>Configuration</h4>
        </CardHeader>
        <CardBody darker={true}>
          <Spin spinning={isRunning}>
            <section>
              <Label text="Select Query">
                <Select value={currentQueryId} onChange={handleQueryChange}>
                  <Option value={-1}>New Query</Option>
                  {queries.map((query: Query, index: number) => (
                    <Option key={index} value={index}>
                      {query.title}
                    </Option>
                  ))}
                </Select>
              </Label>
              <section>
                <Label text="Query Title" style={{ marginTop: 16 }}>
                  <Input
                    onChange={handleQueryTitleChange}
                    placeholder="Query Title"
                    value={queryTitle}
                  />
                </Label>
                <Label text="Query" style={{ marginTop: 16 }} required={true}>
                  <TextArea
                    value={queryContent}
                    onChange={handleQueryContentChange}
                  />
                </Label>
              </section>
              <Label text="Select Protocol" style={{ marginTop: 16 }}>
                <Select
                  value={currentProtocol}
                  onChange={handleProtocolChange}
                  disabled={isRunning}
                >
                  <Option value={Protocol.REST}>REST</Option>
                  <Option value={Protocol.GRPC}>gRPC</Option>
                </Select>
              </Label>
              <Label
                text={
                  <Tooltip
                    placement="right"
                    title={"Number of requests to send sequentially."}
                  >
                    <span style={{ marginRight: 8 }}>Amount</span>
                    <Icon type="info-circle" />
                  </Tooltip>
                }
                style={{ marginTop: 16 }}
              >
                <Input
                  onChange={handleAmountChange}
                  placeholder="Amount"
                  value={amount}
                  type="number"
                />
              </Label>
            </section>
          </Spin>
          <section style={{ marginTop: 48 }}>
            <Button
              loading={isRunning}
              type="primary"
              block={true}
              onClick={runQuery}
              disabled={!queryContent}
            >
              Run
            </Button>
            {isRunning && (
              <Progress percent={progress} status="active" showInfo={false} />
            )}
            <Level>
              <Button
                disabled={currentQueryId >= 0 || isRunning}
                onClick={saveQuery}
                style={{ marginTop: 16, marginRight: 16, width: "50%" }}
              >
                Save Query
              </Button>
              <Button
                disabled={isRunning}
                onClick={resetQuery}
                style={{ marginTop: 16, width: "50%" }}
              >
                Reset
              </Button>
            </Level>
            <Button
              disabled={currentQueryId === -1 || isRunning}
              onClick={removeQuery}
              type="danger"
              block={true}
              style={{ marginTop: 16 }}
            >
              Remove Query
            </Button>
          </section>
        </CardBody>
      </Card>
    </div>
  );
};

export default Sider;
