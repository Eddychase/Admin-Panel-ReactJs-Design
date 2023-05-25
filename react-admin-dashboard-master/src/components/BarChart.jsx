import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://mobried-admin-panel.onrender.com/api/transactions")
      .then((response) => response.json())
      .then((transactions) => {
        const chartData = [
          { month: "Jan", transactions: 0 },
          { month: "Feb", transactions: 0 },
          { month: "Mar", transactions: 0 },
          { month: "Apr", transactions: 0 },
          { month: "May", transactions: 0 },
          { month: "Jun", transactions: 0 },
          { month: "Jul", transactions: 0 },
          { month: "Aug", transactions: 0 },
          { month: "Sep", transactions: 0 },
          { month: "Oct", transactions: 0 },
          { month: "Nov", transactions: 0 },
          { month: "Dec", transactions: 0 },
        ];

        transactions.forEach((transaction) => {
          const month = new Date(transaction.createdAt).getMonth();
          chartData[month].transactions++;
        });

        setData(chartData);
      });
  }, []);

  const formatValue = (value) => Math.round(value);

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["transactions"]}
      indexBy="month"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={{ scheme: "nivo" }}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "month",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
tickRotation: 0,
legend: isDashboard ? undefined : "transactions",
legendPosition: "middle",
legendOffset: -40,
}}
enableLabel={false}
labelSkipWidth={12}
labelSkipHeight={12}
labelTextColor={{
from: "color",
modifiers: [["darker", 1.6]],
}}

role="application"
barAriaLabel={function (e) {
return (
e.id + ": " + e.formattedValue + " in month: " + e.indexValue
);
}}
formatValue={formatValue}
/>
);
};

export default BarChart;