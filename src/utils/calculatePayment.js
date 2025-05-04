const calculatePayments = (matchedRecords) => {
  const totalAmountSum = matchedRecords.reduce(
    (sum, entry) => sum + Number(entry.total_amount || 0),
    0
  );
  const paidAmountSum = matchedRecords.reduce(
    (sum, entry) => sum + Number(entry.paid_amount || 0),
    0
  );
  return {
    totalAmount: totalAmountSum.toString(),
    balanceAmount: (totalAmountSum - paidAmountSum).toString(),
  };
};

export default calculatePayments
