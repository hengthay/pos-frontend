const formatOnlyDay = (dateString) => {
  if(!dateString) return;

  const postedDate = new Date(dateString);
  const today = new Date();

  const diffMs = today - postedDate;

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  // Return logic based on how much time has passed
  if (diffSecs < 60) {
    return "Just now";
  }
  
  if (diffMins < 60) {
    return `${diffMins}m`; // e.g. 5m ago
  }

  if (diffHrs < 24) {
    return `${diffHrs}h`; // e.g. 3h ago
  }

  return `${diffDays}d`; // e.g. 2d ago
}

export default formatOnlyDay;