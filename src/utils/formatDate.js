const formatDate = (inputDate) => {
  if (!inputDate) return "-";
  const [year, month, day] = inputDate.split("-");
  return `${day}-${month}-${year}`;
};

export default formatDate;
