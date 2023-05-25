import { ResponsiveLine } from "@nivo/line";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("https://mobried-admin-panel.onrender.com/api/transactions")
      .then((response) => response.json())
      .then((data) => setTransactions(data));
  }, []);

  // Function to generate data for the line chart based on transactions
  const generateLineData = () => {
    const data = [
      {
        id: "transactions",
        data: [],
      },
    ];

    const chartData = [
      { month: "January", total: 0 },
      { month: "February", total: 0 },
      { month: "March", total: 0 },
      { month: "April", total: 0 },
      { month: "May", total: 0 },
      { month: "June", total: 0 },
      { month: "July", total: 0 },
      { month: "August", total: 0 },
      { month: "September", total: 0 },
      { month: "October", total: 0 },
      { month: "November", total: 0 },
      { month: "December", total: 0 },
    ];

    transactions.forEach((transaction) => {
      const month = new Date(transaction.createdAt).getMonth();
      chartData[month].total += transaction.totalPrice;
    });

    chartData.forEach(({ month, total }) => {
      data[0].data.push({ x: month, y: total });
    });

    return data;
  };

  const lineData = generateLineData();

  return (
    <ResponsiveLine
      data={lineData}
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
        tooltip: {
          container: {
            background: colors.primary[500], // Changed from 'color' to 'background'
          },
        },
      }}
      colors={isDashboard ? { scheme: "category10" } : { scheme: "nivo" }} // Changed from 'datum' to 'category10'
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation",
        legendOffset
: 36,
legendPosition: "middle",
}}
axisLeft={{
orient: "left",
tickValues: 5,
tickSize: 3,
tickPadding: 5,
tickRotation: 0,
legend: isDashboard ? undefined : "count",
legendOffset: -40,
legendPosition: "middle",
}}
enableGridX={false}
enableGridY={false}
pointSize={8}
pointColor={colors.background} // Changed from '{ theme: "background" }' to 'colors.background'
pointBorderWidth={2}
pointBorderColor={{ from: "color", modifiers: [["darker", 0.3]] }} // Added 'modifiers' array
pointLabelYOffset={-12}
useMesh={true}
legends={[
{
anchor: "bottom-right",
direction: "column",
justify: false,
translateX: 100,
translateY: 0,
itemsSpacing: 0,
itemDirection: "left-to-right",
itemWidth: 80,
itemHeight: 20,
itemOpacity: 0.75,
symbolSize: 12,
symbolShape: "circle",
symbolBorderColor: "rgba(0, 0, 0, .5)",
effects: [
{
on: "hover",
style: {
itemBackground: "rgba(0, 0, 0, .03)",
itemOpacity: 1,
},
},
],
},
]}
/>
);
};

export default LineChart;

