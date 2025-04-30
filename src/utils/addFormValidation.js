export const getFormData = ({
  cultiSelected,
  hours,
  minutes,
  noOfTrips,
  phoneNumber,
  isPaid,
  paymentSelected,
  totalAmount,
  paidAmount,
}) => {
  const formData = {
    name: document.getElementById("name").value.trim(),
    date: document.getElementById("date").value,
    amount: parseFloat(totalAmount),
    phoneNumber: document.getElementById("phoneNumber").value.trim(),
    cultiSelected: cultiSelected ? cultiSelected.value : null,
    isPaid,
    ...(isPaid && {
      modeOfPayment: paymentSelected ? paymentSelected.value : null,
      paidAmount: parseFloat(paidAmount),
    }),
  };

  const timeBasedCulti = [
    "rotavator",
    "5tynes",
    "9tynes",
    "landLeveler",
    "discPlough",
  ].includes(cultiSelected?.value);

  if (timeBasedCulti) {
    formData.hours = hours;
    formData.minutes = minutes;
  } else {
    formData.noOfTrips = noOfTrips;
  }

  return formData;
};

export const addFormValidation = (formData) => {
  const errors = {};
  const {
    name,
    date,
    cultiSelected,
    amount,
    paidAmount,
    hours,
    minutes,
    noOfTrips,
    isPaid,
    modeOfPayment,
    phoneNumber,
  } = formData;

  // Basic validations
  if (!name) errors.name = "Name is required";
  if (!date) errors.date = "Date is required";
  if (!cultiSelected) errors.cultivator = "Cultivator selection is required";
  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    errors.totalAmount = "Enter a valid total amount";
  }
  if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = "Phone number must be exactly 10 digits.";
  }
  if (isPaid) {
    if (!modeOfPayment) errors.payment = "Payment type is required";
    const paid = parseFloat(paidAmount);

    if (isNaN(paid) || paid <= 0) {
      errors.paidAmount = "Enter a valid paid amount";
    }
  }
  const timeBasedCulti = [
    "rotavator",
    "5tynes",
    "9tynes",
    "landLeveler",
    "discPlough",
  ];
  if (timeBasedCulti.includes(cultiSelected)) {
    if (parseInt(hours) <= 0 && parseInt(minutes) <= 0) {
      errors.time = "Add Either hrs or min";
    }
  } else if (cultiSelected) {
    if (!noOfTrips || parseInt(noOfTrips) <= 0) {
      errors.trips = "Please enter the number of trips";
    }
  }

  return errors;
};
