import React from 'react';
import Typography from './Typography';
import '../styles.css';

const Widget = ({ value, unit, description }) => {
  return (
    <div className='widget'>
      <Typography variant='title'>
        {value}
        <span className='subtitle'>{unit}</span>
      </Typography>
      <Typography variant='body'>
        {description}
      </Typography>
    </div>


  );
};

export default Widget;
