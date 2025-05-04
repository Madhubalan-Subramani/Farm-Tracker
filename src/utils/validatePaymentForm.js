export const validatePaymentForm = ({
  name,
  date,
  paidAmount,
  paymentSelected,
  allData,
}) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  } else {
    const matched = allData.some(
      (record) => record.name.toLowerCase() === name.toLowerCase()
    );
    if (!matched) {
      errors.name = "Name does not exist";
    }
  }

  if (!date) {
    errors.date = "Date is required";
  }

  if (!paidAmount || isNaN(paidAmount) || Number(paidAmount) <= 0) {
    errors.paidAmount = "Enter a valid paid amount";
  }

  if (!paymentSelected) {
    errors.payment = "Select a payment method";
  }

  return errors;
};
