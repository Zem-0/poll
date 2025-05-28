/* eslint-disable @next/next/no-img-element */
"use client";
import Chart from "chart.js/auto";
import React, { useEffect, useRef } from "react";

const LineChart = ({ drop_off_amounts }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);
  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartContainer.current.getContext("2d");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: Object.keys(drop_off_amounts),
          datasets: [
            {
              label: false, // Disable legend for this dataset
              data: Object.values(drop_off_amounts).map((value) => value),
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false, // Hide the legend
            },
          },
          scales: {
            x: {
              display: true, // Display x-axis
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [drop_off_amounts]);

  return (
    <>
      {" "}
      <div className="w-full bg-white px-12 py-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <div className="text-Dark-gray front-semibold">PRIMARY TEXT</div>
            <div className="ml-auto">
              <img src="/images/polls/group.svg" alt="" />
            </div>
          </div>
          <div className="text-Pri-Dark font-msm font-normal">
            Secondary text
          </div>
        </div>
        <canvas ref={chartContainer} className="w-full" />
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center gap-4">
            <div className="bg-[#165BAA] w-6 h-4"></div>
            <div># of starts</div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="bg-[#A155B9] 0 w-6 h-4"></div>
            <div># of completion</div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="bg-[#F765A3] w-6 h-4"></div>
            <div># of drop-offs</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LineChart;
