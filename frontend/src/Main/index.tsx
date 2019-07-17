import { Alert, Button } from "antd";
import Chart from "chart.js";
import _ from "lodash";
import React, { useEffect } from "react";
import { CSVLink } from "react-csv";
import Card, { CardBody, CardFooter, CardHeader } from "../components/Card";
import Level from "../components/Level";
import Table, { TableColumn, TableRow } from "../components/Table";
import { Protocol } from "../models/Protocol";
import { Request } from "../models/Request";
import "./index.scss";

interface Props {
  isRunning: boolean;
  requests: Request[];
  onReset: () => void;
}

const Main: React.FunctionComponent<Props> = ({
  isRunning,
  requests,
  onReset
}) => {
  const lineChartCanvas = React.createRef<HTMLCanvasElement>();
  const pieChartCanvas = React.createRef<HTMLCanvasElement>();

  const filterSuccessful = (_requests: Request[]) => {
    return _requests.filter((request: Request) => request.ok);
  };

  const filterFailed = (_requests: Request[]) => {
    return _requests.filter((request: Request) => !request.ok);
  };

  const calcFastest = (_requests: Request[]) => {
    return Math.round(
      _.min(
        filterSuccessful(requests).map((request: Request) => request.duration)
      )! / 1000000
    );
  };

  const calcSlowest = (_requests: Request[]) => {
    return Math.round(
      _.max(
        filterSuccessful(requests).map((request: Request) => request.duration)
      )! / 1000000
    );
  };

  useEffect(() => {
    const pieChart = new Chart(pieChartCanvas.current!, {
      type: "doughnut",
      data: {
        labels: ["Success", "Failure"],
        datasets: [
          {
            data: [
              filterSuccessful(requests).length,
              filterFailed(requests).length
            ],
            backgroundColor: ["#52c41a", "#f5222d"],
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 16,
            padding: 16
          }
        }
      }
    });
    return () => {
      pieChart.destroy();
    };
  }, [requests]);

  useEffect(() => {
    const lineChart = new Chart(lineChartCanvas.current!, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Response Time (ms)",
            backgroundColor: "#1890ff55",
            borderColor: "#1890ff",
            data: requests.map((request: Request, index: number) => ({
              x: index + 1,
              y: request.duration / 1000000
            }))
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: "linear"
            }
          ]
        },
        legend: {
          position: "bottom"
        }
      }
    });
    return () => {
      lineChart.destroy();
    };
  }, [requests]);

  const getFilename = () => {
    return `requests-${
      requests[0].protocol === Protocol.REST ? "rest" : "grpc"
    }`;
  };

  const formatExportData = () => {
    return requests.map((request: Request) => ({
      ...request,
      ok: request.ok ? 1 : 0,
      protocol: request.protocol === Protocol.REST ? "REST" : "GRPC"
    }));
  };

  return (
    <div className="main">
      <section className="reporting" style={{ marginBottom: 16 }}>
        <Card style={{ gridArea: "line" }}>
          <CardHeader>
            <Level>
              <h4>Response Time</h4>
              <Button
                size="small"
                type="primary"
                disabled={!requests || requests.length === 0 || isRunning}
                onClick={onReset}
              >
                Reset
              </Button>
            </Level>
          </CardHeader>
          <CardBody>
            <canvas ref={lineChartCanvas} />
          </CardBody>
        </Card>
        <Card style={{ gridArea: "pie" }}>
          <CardHeader>
            <h4>Successful Responses</h4>
          </CardHeader>
          <CardBody>
            <canvas ref={pieChartCanvas} />
            <p style={{ textAlign: "center", marginTop: 16 }}>
              Successful Requests:{" "}
              {requests && requests.length > 0
                ? filterSuccessful(requests).length
                : "-"}
            </p>
            <p style={{ textAlign: "center" }}>
              Failed Requests:{" "}
              {requests && requests.length > 0
                ? filterFailed(requests).length
                : "-"}
            </p>
          </CardBody>
        </Card>

        <Card style={{ gridArea: "avg" }}>
          <CardHeader>
            <h4>Average Response Time</h4>
          </CardHeader>
          <CardBody>
            <h1>
              {requests && requests.length > 0
                ? `${Math.round(
                    _.sum(
                      filterSuccessful(requests).map(
                        (request: Request) => request.duration
                      )
                    ) /
                      filterSuccessful(requests).length /
                      1000000
                  )}ms`
                : "-"}
            </h1>
          </CardBody>
        </Card>
        <Card style={{ gridArea: "fast" }}>
          <CardHeader>
            <h4>Fastest Response</h4>
          </CardHeader>
          <CardBody>
            <h1>
              {requests && requests.length > 0
                ? `${calcFastest(requests)}ms`
                : "-"}
            </h1>
          </CardBody>
        </Card>
        <Card style={{ gridArea: "slow" }}>
          <CardHeader>
            <h4>Slowest Response</h4>
          </CardHeader>
          <CardBody>
            <h1>
              {requests && requests.length > 0
                ? `${calcSlowest(requests)}ms`
                : "-"}
            </h1>
          </CardBody>
        </Card>
      </section>
      {requests && requests.length > 0 ? (
        <Card>
          <CardHeader>
            <Level>
              <h4>Responses</h4>
              <Button
                size="small"
                type="primary"
                disabled={!requests || requests.length === 0 || isRunning}
              >
                <CSVLink
                  filename={getFilename()}
                  data={formatExportData()}
                  headers={["timestamp", "id", "duration", "ok", "protocol"]}
                >
                  Export
                </CSVLink>
              </Button>
            </Level>
          </CardHeader>
          <CardBody padded={false}>
            <Table
              data={requests.slice(0, 20)}
              columnTitles={["ID", "Duration (ms)", "Successful"]}
              renderRow={(request: Request, index: number) => (
                <TableRow key={index}>
                  <TableColumn>{request.id}</TableColumn>
                  <TableColumn>
                    {Math.round(request.duration / 1000000)}
                  </TableColumn>
                  <TableColumn>{request.ok ? "Yes" : "No"}</TableColumn>
                </TableRow>
              )}
            />
          </CardBody>
          {requests && requests.length > 20 ? (
            <CardFooter>
              <Alert
                showIcon={true}
                message="The table only shows the first 20 results. Export the data to see all requests."
                type="info"
              />
            </CardFooter>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
};

export default Main;
