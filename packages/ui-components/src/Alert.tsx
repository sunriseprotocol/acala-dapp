import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';

import { MessageType, BareProps } from './types';
import { ReactComponent as AlertIcon } from './assets/alert.svg';
import './Alert.scss';

interface AlertProps extends BareProps {
  message: ReactNode;
  type?: MessageType;
  icon?: ReactNode;
  messageClassName?: string;
}

export const Alert: FC<AlertProps> = ({ className, icon, message, messageClassName, type }) => {
  return (
    <div className={clsx('aca-alert', type, className)}>
      { icon || <AlertIcon className='aca-alert__icon' /> }
      <span className={clsx('aca-alert__message', messageClassName)}>{message}</span>
    </div>
  );
};
