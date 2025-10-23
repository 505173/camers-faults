import styles from "./CharView.module.css";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { TestData } from "../../types";

type Props = {
  data: TestData[];
};

export const ChartView = ({ data }: Props) => {
  return (
    <div className={styles.chartWrapper}>
      <LineChart width={500} height={250} data={data}>
        <XAxis dataKey="delay" label={{ value: "Delay (ms)", position: "insideBottomRight", offset: -5 }} />
        <YAxis dataKey="framesDetected" label={{ value: "Frames", angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="framesDetected" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};
