import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface BarChartProps {
  data: { month: string; price: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);

      const option: echarts.EChartsOption = {
        title: {
          text: "Monthly Prices",
        },
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const item = params[0];
            return `${item.axisValue}<br/>Price: ${
              item.data === 0 ? "No Data" : item.data
            }`;
          },
        },
        xAxis: {
          type: "category",
          data: data.map(item => item.month),
          axisLabel: {
            interval: 0, // show all months
            rotate: 45, // rotate if crowded
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            data: data.map(item => item.price),
            itemStyle: {
              color: "#5470C6", // bar color
            },
          },
        ],
      };

      chartInstanceRef.current.setOption(option);
    }

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstanceRef.current?.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px" }} />;
};

export default BarChart;
