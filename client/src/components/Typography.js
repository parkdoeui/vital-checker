import React from 'react';
import '../styles.css';

const Typography = ({ variant, children }) => {

  return (
    <p className={variant}>{children}</p>
  );
};

export default Typography;
