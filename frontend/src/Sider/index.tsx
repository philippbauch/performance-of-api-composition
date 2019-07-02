import { Button, Select, Switch } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import grpcCachedAgent from "../api/grpc-cached.agent";
import grpcAgent from "../api/grpc.agent";
import restCachedAgent from "../api/rest-cached.agent";
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

const Option = Select.Option;

interface Props {
  isRunning: boolean;
  onRequests: (requests: Request[]) => void;
  onStartRunning: () => void;
  onStopRunning: () => void;
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
  } = useFormInput("1");
  const [currentProtocolId, setCurrentProtocolId] = useState<number>(
    Protocol.REST
  );
  const [currentQueryId, setCurrentQueryId] = useState<number>(0);
  const [isEnableCaching, setIsEnableCaching] = useState<boolean>(false);
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

  const handleProtocolChange = (protocolId: number) => {
    if (protocolId === currentProtocolId) {
      return;
    }
    setCurrentProtocolId(protocolId);
  };

  const handleQueryChange = (queryId: number) => {
    if (queryId === currentQueryId) {
      return;
    }
    if (queryId !== 0) {
      setCurrentQueryId(queryId);
      const query = queries[queryId - 1];
      setAmount(String(query.amount));
      setCurrentProtocolId(query.protocol);
      setIsEnableCaching(query.caching);
      setQueryContent(query.content);
      setQueryTitle(query.title);
    } else {
      resetQuery();
    }
  };

  const removeQuery = () => {
    const queryToRemove = queries[currentQueryId - 1];
    const queriesNew = _.without(queries, queryToRemove);
    const queriesStringified = JSON.stringify({
      queries: queriesNew
    });
    localStorage.setItem("queries", queriesStringified);
    setQueries(queriesNew);
    resetQuery();
  };

  const resetQuery = () => {
    setAmount("1");
    setCurrentProtocolId(Protocol.REST);
    setCurrentQueryId(0);
    setIsEnableCaching(false);
    setQueryContent("");
    setQueryTitle("");
  };

  const runQuery = async () => {
    onStartRunning();
    const client: any =
      currentProtocolId === Protocol.REST
        ? isEnableCaching
          ? restCachedAgent
          : restAgent
        : isEnableCaching
        ? grpcCachedAgent
        : grpcAgent;

    const query: Query = {
      title: queryTitle,
      content: queryContent,
      protocol: currentProtocolId,
      caching: isEnableCaching,
      amount: Number(amount)
    };

    const requests: Request[] = [];

    for (let i = 0; i < Number(amount); i++) {
      try {
        const { extensions } = await client.rawRequest(query.content);
        requests.push({
          ok: true,
          time: extensions.tracing.duration
        });
      } catch (error) {
        console.error(error);
        requests.push({
          ok: false,
          time: 0
        });
      }
    }
    onRequests(requests);
    onStopRunning();
  };

  const saveQuery = () => {
    const query: Query = {
      title: queryTitle,
      content: queryContent,
      protocol: currentProtocolId,
      caching: isEnableCaching,
      amount: Number(amount)
    };
    const queriesNew = [...queries, query];
    const queriesStringified = JSON.stringify({
      queries: queriesNew
    });
    localStorage.setItem("queries", queriesStringified);
    setQueries(queriesNew);
    setCurrentQueryId(queries.length + 1);
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
      <Card style={{ height: "100%" }}>
        <CardHeader>
          <h4>Configuration</h4>
        </CardHeader>
        <CardBody darker={true}>
          <section>
            <Label text="Select Query">
              <Select value={currentQueryId} onChange={handleQueryChange}>
                <Option value={0}>New Query</Option>
                {queries.map((query: Query, index: number) => (
                  <Option key={index} value={index + 1}>
                    {query.title}
                  </Option>
                ))}
              </Select>
            </Label>
            {currentQueryId === 0 ? (
              <section>
                <Label text="Query Title" style={{ marginTop: 16 }}>
                  <Input
                    onChange={handleQueryTitleChange}
                    placeholder="Query Title"
                    value={queryTitle}
                  />
                </Label>
                <Label text="Query" style={{ marginTop: 16 }}>
                  <TextArea
                    value={queryContent}
                    onChange={handleQueryContentChange}
                  />
                </Label>
              </section>
            ) : null}
            <Label text="Select Protocol" style={{ marginTop: 16 }}>
              <Select value={currentProtocolId} onChange={handleProtocolChange}>
                <Option value={Protocol.REST}>REST</Option>
                <Option value={Protocol.GRPC}>gRPC</Option>
              </Select>
            </Label>
            <Label text="Enable Caching" style={{ marginTop: 16 }}>
              <Switch
                checked={isEnableCaching}
                onChange={(enableCaching: boolean) =>
                  setIsEnableCaching(enableCaching)
                }
              />
            </Label>
            <Label text="Amount" style={{ marginTop: 16 }}>
              <Input
                onChange={handleAmountChange}
                placeholder="Amount"
                value={amount}
                type="number"
              />
            </Label>
          </section>
          <section style={{ marginTop: 48 }}>
            <Button
              loading={isRunning}
              type="primary"
              block={true}
              onClick={runQuery}
            >
              Run
            </Button>
            <Level>
              <Button
                disabled={currentQueryId !== 0 || isRunning}
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
              disabled={currentQueryId === 0 || isRunning}
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
