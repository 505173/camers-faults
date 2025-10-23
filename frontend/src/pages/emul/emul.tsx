import { useState } from "react";
import { NetworkForm } from "../../components/emul/NetworkForm";
import { TestResult } from "../../components/emul/TestResult";
import { ChartView } from "../../components/emul/CharView";
import { TestData } from "../../types";
import styles from "./emul.module.css";

function App() {
  const [results, setResults] = useState<TestData[]>([]);
  const [lastTest, setLastTest] = useState<TestData | null>(null);

  const applyEmulation = async (delay: number, jitter: number, loss: number) => {
    await fetch("http://localhost:3000/emulator/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delay, jitter, loss }),
    });
    alert("Эмуляция применена");
  };

  const testRtsp = async (delay: number, jitter: number, loss: number) => {
    const res = await fetch("http://localhost:3000/emulator/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rtspUrl: "rtsp://localhost/stream", duration: 5 }),
    });
    const data = await res.json();
    const testData: TestData = { delay, jitter, loss, framesDetected: data.framesDetected || 0 };
    setResults([...results, testData]);
    setLastTest(testData);
  };

  return (
    <div className={styles.container}>
      <NetworkForm onApply={applyEmulation} onTest={testRtsp} />
      {lastTest && <TestResult framesDetected={lastTest.framesDetected} rawLog="..." />}
      {results.length > 0 && <ChartView data={results} />}
    </div>
  );
}

export default App;
