const checkSensorStatus = (value, threshold) => {
    if (value > threshold * 1.2) return 'critical';
    if (value > threshold) return 'warning';
    return 'operational';
  };
  
  export default { checkSensorStatus };