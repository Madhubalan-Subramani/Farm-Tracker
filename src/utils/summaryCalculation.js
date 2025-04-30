export const summaryCalculation = (data) => {
  const summary = data.reduce(
    (acc, item) => {
      acc.totalAmount += Number(item.total_amount || 0);
      acc.paidAmount += Number(item.paid_amount || 0);
      return acc;
    },
    { totalAmount: 0, paidAmount: 0 }
  );

  return {
    totalAmount: summary.totalAmount,
    paidAmount: summary.paidAmount,
    balanceAmount: summary.totalAmount - summary.paidAmount,
  };
};
