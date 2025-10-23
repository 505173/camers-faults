import styles from "./TestResult.module.css";

type Props = {
  framesDetected: number;
  rawLog: string;
};

export const TestResult = ({ framesDetected, rawLog }: Props) => {
  return (
    <div className={styles.resultContainer}>
      <h3>Результаты теста</h3>
      <p>Обнаружено фреймов: {framesDetected}</p>
      <details className={styles.details}>
        <summary>Лог FFmpeg</summary>
        <pre>{rawLog}</pre>
      </details>
    </div>
  );
};
