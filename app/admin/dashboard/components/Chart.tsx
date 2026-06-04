"use client";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ChartProps {
  categories: string[];
  series: {
    name: string;
    data: number[];
  }[];
  type: string;
}

export default function Chart({ categories, series, type }: ChartProps) {
  const options = {
    chart: {
      type,
    },

    title: {
      text: null,
    },

    xAxis: {
      categories,
    },

    series,

    credits: {
      enabled: false,
    },
  };
  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
