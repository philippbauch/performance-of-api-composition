import { Button } from "antd";
import Chart from "chart.js";
import _ from "lodash";
import React, { useEffect } from "react";
import Card, { CardBody, CardHeader } from "../components/Card";
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

  return (
    <div className="main">
      <section className="reporting" style={{ marginBottom: 16 }}>
        <Card style={{ gridArea: "line" }}>
          <CardHeader>
            <h4>Response Time</h4>
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
              Successful Responses:{" "}
              {requests && requests.length > 0
                ? filterSuccessful(requests).length
                : "-"}
            </p>
            <p style={{ textAlign: "center" }}>
              Failed Responses:{" "}
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
      <Button type="primary" disabled={isRunning} onClick={onReset}>
        Clear
      </Button>
    </div>
  );
};

export default Main;
