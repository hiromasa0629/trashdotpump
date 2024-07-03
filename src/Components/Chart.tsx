import { Box } from "@chakra-ui/react";
import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "react";

type ChartProps = {
  data: any;
};

const colors = {
  backgroundColor: "white",
  lineColor: "#2962FF",
  textColor: "black",
  areaTopColor: "#2962FF",
  areaBottomColor: "rgba(41, 98, 255, 0.28)",
};

const Chart = (props: ChartProps) => {
  const { data } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      height: 450,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({
      // : colors.lineColor,
      // topColor: colors.areaTopColor,
      // bottomColor: colors.areaBottomColor,
      upColor: "green",
      downColor: "red",
    });
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [data]);

  return <Box ref={chartContainerRef} w={"100%"} />;
};

export default Chart;
