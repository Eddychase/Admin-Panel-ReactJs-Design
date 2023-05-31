import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = 0, size = 40 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProgress((prevProgress) => prevProgress + 1);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const angle = (currentProgress / 100) * 360;

  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[900]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, #24fe41 ${angle}deg 360deg),
            #00bf8f`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;
