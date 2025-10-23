import { useState } from "react";
import styles from "./NetworkForm.module.css";

type Props = {
  onApply: (delay: number, jitter: number, loss: number) => void;
  onTest: (delay: number, jitter: number, loss: number) => void;
};

export const NetworkForm = ({ onApply, onTest }: Props) => {
  const [delay, setDelay] = useState(50);
  const [jitter, setJitter] = useState(10);
  const [loss, setLoss] = useState(1);

  return (
    <div className={styles.formContainer}>
      <h2>Настройка сети</h2>
      <input
        type="number"
        value={delay}
        onChange={(e) => setDelay(+e.target.value)}
        placeholder="Задержка (ms)"
      />
      <input
        type="number"
        value={jitter}
        onChange={(e) => setJitter(+e.target.value)}
        placeholder="Джиттер (ms)"
      />
      <input
        type="number"
        value={loss}
        onChange={(e) => setLoss(+e.target.value)}
        placeholder="Потери (%)"
      />
      <div className={styles.buttonGroup}>
        <button
          onClick={() => onApply(delay, jitter, loss)}
          className={`${styles.button} ${styles.applyButton}`}
        >
          Применить эмуляцию
        </button>
        <button
          onClick={() => onTest(delay, jitter, loss)}
          className={`${styles.button} ${styles.testButton}`}
        >
          Запустить тест
        </button>
      </div>
    </div>
  );
};
