import React, { useState } from 'react';
import styles from './CameraChecker.module.css'; // Убедитесь что имя файла совпадает!

interface Camera {
  id: number;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'recording';
}

const CameraChecker: React.FC = () => { // Изменил имя компонента на CameraChecker
  const [cameras] = useState<Camera[]>([
    {
      id: 1,
      name: 'INS_046',
      ip: '89.208.118.174',
      status: 'online'
    },
    {
      id: 2,
      name: 'INS_046',
      ip: '89.208.118.174',
      status: 'recording'
    },
    {
      id: 3,
      name: 'INS_046',
      ip: '89.208.118.174',
      status: 'offline'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#FFFF00';
      case 'recording': return '#FF0000';
      default: return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Работает';
      case 'offline': return 'Работает с перебоями';
      case 'recording': return 'Не работает';
      default: return status;
    }
  };

  return (
    <div className={styles.cameraTableContainer}>
      <div className={styles.cameraTableHeader}>
        <h1>Камеры</h1>
      </div>
      
      <div className={styles.cameraTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Название </div>
          <div className={styles.headerCell}>ip </div>
          
          <div className={styles.headerCell}>Статус</div>
        </div>
        
        <div className={styles.tableBody}>
          {cameras.map((camera) => (
            <div key={camera.id} className={styles.tableRow}>
              <div className={styles.tableCell}>{camera.name}</div>
              <div className={styles.tableCell}>{camera.ip}</div>
              <div className={styles.statusCell}>
                <span 
                  className={styles.statusIndicator}
                  style={{ backgroundColor: getStatusColor(camera.status) }}
                ></span>
                {getStatusText(camera.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CameraChecker;