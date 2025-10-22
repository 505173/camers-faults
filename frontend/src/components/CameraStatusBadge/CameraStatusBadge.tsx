import { FC } from 'react';
import { CameraStatus } from '../../types/camera';
import styles from './CameraStatusBadge.module.css';

interface CameraStatusBadgeProps {
  status: CameraStatus;
}

const CameraStatusBadge: FC<CameraStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    [CameraStatus.WORKING]: {
      text: 'Работает',
      className: styles.working,
    },
    [CameraStatus.NOT_WORKING]: {
      text: 'Не работает',
      className: styles.notWorking,
    },
    [CameraStatus.DEFECT]: {
      text: 'С дефектами',
      className: styles.defect,
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`${styles.badge} ${config.className}`}>
      {config.text}
    </span>
  );
};

export default CameraStatusBadge;