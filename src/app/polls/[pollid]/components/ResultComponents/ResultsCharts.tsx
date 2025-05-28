"use client";
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Pie, Doughnut, Bar, Line } from "react-chartjs-2";
import { Box, Typography, Card, CardContent } from "@mui/material";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const getChartForQuestion = (questionData: any, index: number) => {
  const { question, type, answers, responses } = questionData;

  if (!answers?.length) return null;

  const labels = answers.map((ans: any) =>
    ans.answer?.length > 40 ? ans.answer.slice(0, 37) + "..." : ans.answer || "No Answer"
  );
  const dataCounts = answers.map((ans: any) => ans.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Responses",
        data: dataCounts,
        backgroundColor: [
          "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
          "#ec4899", "#22d3ee", "#14b8a6", "#eab308", "#f97316"
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: type !== "RATING",
        position: "bottom" as const,
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case "MCQ":
        return <Doughnut data={chartData} options={chartOptions} />;
      case "RATING":
        return <Bar data={chartData} options={chartOptions} />;
      case "FREE_TEXT":
        const timeSeries = responses?.reduce((acc: any, curr: any) => {
          const date = new Date(curr.timestamp).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        const timeChartData = {
          labels: Object.keys(timeSeries),
          datasets: [
            {
              label: "Responses Over Time",
              data: Object.values(timeSeries),
              backgroundColor: "#3b82f6",
              borderColor: "#2563eb",
              fill: true,
              tension: 0.3,
            },
          ],
        };
        return <Line data={timeChartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <Card key={index} sx={{ my: 4, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {index + 1}. {question}
        </Typography>
        <Box height={type === "FREE_TEXT" ? 250 : 350}>{renderChart()}</Box>
      </CardContent>
    </Card>
  );
};

interface ResultsChartsProps {
  data: Record<string, any>;
}

const ResultsCharts: React.FC<ResultsChartsProps> = ({ data }) => {
  const questionsArray = Object.values(data);

  return (
    <Box sx={{ p: 3 }}>
      {questionsArray.map((q, idx) => getChartForQuestion(q, idx))}
    </Box>
  );
};

export default ResultsCharts;
