import { Button, Divider } from "antd";
import Chart from "chart.js";
import React, { useEffect } from "react";
import Card, { CardBody, CardHeader } from "../components/Card";
import Level from "../components/Level";
import Table, { TableColumn, TableRow } from "../components/Table";
import "./index.scss";

const Main: React.FunctionComponent = () => {
  const pieChartCanvas = React.createRef<HTMLCanvasElement>();
  const lineChartCanvas = React.createRef<HTMLCanvasElement>();

  useEffect(() => {
    const pieChart = new Chart(pieChartCanvas.current!, {
      type: "doughnut",
      data: {
        labels: ["Success", "Failure"],
        datasets: [
          {
            data: [5, 1],
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
  }, []);

  useEffect(() => {
    const lineChart = new Chart(lineChartCanvas.current!, {
      type: "line",
      data: {
        labels: ["Success", "Failure"],
        datasets: [
          {
            data: [5, 1],
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
  }, []);

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
          </CardBody>
        </Card>

        <Card style={{ gridArea: "avg" }}>
          <CardHeader>
            <h4>Average Response Time</h4>
          </CardHeader>
          <CardBody>
            <h1>442ms</h1>
          </CardBody>
        </Card>
        <Card style={{ gridArea: "fast" }}>
          <CardHeader>
            <h4>Fastest Response</h4>
          </CardHeader>
          <CardBody>
            <h1>256ms</h1>
          </CardBody>
        </Card>
        <Card style={{ gridArea: "slow" }}>
          <CardHeader>
            <h4>Slowest Response</h4>
          </CardHeader>
          <CardBody>
            <h1>742ms</h1>
          </CardBody>
        </Card>
      </section>
      <Button type="primary" style={{ marginRight: 16 }}>
        Rank
      </Button>
      <Button>Clear</Button>

      <Divider />

      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <Level>
            <h4>Test Cases</h4>
            <a>Clear</a>
          </Level>
        </CardHeader>
        <CardBody>
          <Table
            data={[]}
            columnTitles={[
              "Title",
              "Protocol",
              "Caching",
              "Avg. Response Time"
            ]}
            renderRow={(item: any, index: number) => (
              <TableRow key={index} onClick={() => {}}>
                <TableColumn>Query</TableColumn>
                <TableColumn>REST</TableColumn>
                <TableColumn>Yes</TableColumn>
                <TableColumn>254ms</TableColumn>
              </TableRow>
            )}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Main;
