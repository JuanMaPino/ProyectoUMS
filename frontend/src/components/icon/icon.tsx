import React from 'react';
import { Icon as MdiIcon } from '@mdi/react';

type Props = {
  path: string;
  size?: string | number;
  w?: string;
  className?: string;
};

const Icon = ({ path, size = 1, w = '', className = '' }: Props) => {
  return <MdiIcon path={path} size={size} className={`${w} ${className}`} />;
};

export default Icon;
