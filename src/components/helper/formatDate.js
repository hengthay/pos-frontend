const formatDate = (dateString) => {
  if(!dateString) return;

  return new Date(dateString).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default formatDate;