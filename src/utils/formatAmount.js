const formatAmount = (amount) => {
  const safeAmount = typeof amount === "number" ? amount : 0;
  return safeAmount.toLocaleString("en-IN");
};

export default formatAmount;
