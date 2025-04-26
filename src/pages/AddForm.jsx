import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import MoneyInput from "../components/form/MoneyInput";
import { culti_options, payment_options } from "../utils/FormOptions";
import { getFormData, validateFormData } from "../utils/validation";
import "./styles/AddForm.css";
import { auth, db } from "../firebase/setup";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddForm = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isPaid, setIsPaid] = useState(false);
  const [cultiSelected, setCultiSelected] = useState(null);
  const [cultiDropdownOpen, setCultiDropdownOpen] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState(null);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [noOfTrips, setNoOfTrips] = useState("0");
  const [totalAmount, setTotalAmount] = useState("0");
  const [paidAmount, setPaidAmount] = useState("0");
  const [formErrors, setFormErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = getFormData({
      name,
      phoneNumber,
      date,
      cultiSelected,
      hours,
      minutes,
      noOfTrips,
      isPaid,
      paymentSelected,
      totalAmount,
      paidAmount,
    });

    const errors = validateFormData(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    const selectedCultivator = culti_options.find(
      (option) => option.value === formData.cultiSelected
    );

    const selectedPayment = payment_options.find(
      (option) => option.value === formData.modeOfPayment
    );

    const cleanedData = {
      userId: auth.currentUser?.uid,
      name: formData.name,
      phone_number: formData.phoneNumber || null,
      date: formData.date,
      cultivator_type: formData.cultiSelected || null,
      total_amount: parseFloat(formData.amount) || 0,
      time_used: [
        "rotavator",
        "5tynes",
        "9tynes",
        "landLeveler",
        "discPlough",
      ].includes(formData.cultiSelected)
        ? {
            hours: parseInt(formData.hours) || 0,
            minutes: parseInt(formData.minutes) || 0,
          }
        : null,
      trips: ![
        "rotavator",
        "5tynes",
        "9tynes",
        "landLeveler",
        "discPlough",
      ].includes(formData.cultiSelected)
        ? parseInt(formData.noOfTrips) || 0
        : null,
      is_paid: isPaid,
      ...(isPaid && {
        mode_of_payment: formData.modeOfPayment,
        paid_amount: parseFloat(formData.paidAmount) || 0,
        modeofpayment_image: selectedPayment?.image || null,
      }),
      posting_time: serverTimestamp(),
      cultivator_type_image: selectedCultivator?.image || null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      status: "active",
    };

    try {
      const userRef = collection(db, "users", auth.currentUser.uid, "userData");
      await addDoc(userRef, cleanedData);
      alert("Data submitted successfully!");
      resetForm();
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Failed to submit. Try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setPhoneNumber("");
    setDate(new Date().toISOString().split("T")[0]);
    setCultiSelected(null);
    setCultiDropdownOpen(false);
    setPaymentSelected(null);
    setPaymentDropdownOpen(false);
    setHours("0");
    setMinutes("0");
    setNoOfTrips("0");
    setTotalAmount("0");
    setPaidAmount("0");
    setIsPaid(false);
    setFormErrors({});
  };

  return (
    <div className="add-form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Add New Record</h2>

        {/* Name */}
        <div className="form-row" style={{ width: "100%" }}>
          <label htmlFor="name">
            Name<span className="required">*</span>
          </label>
          <div className="input-with-icon">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
            />

            <button type="button" className="mic-icon">
              <FaMicrophone />
            </button>
          </div>
          {formErrors.name && <p className="error">{formErrors.name}</p>}
        </div>

        {/* Date and Phone */}
        <div className="row-two">
          <div className="form-row">
            <label>
              Date<span className="required">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              autoComplete="off"
            />

            {formErrors.date && <p className="error">{formErrors.date}</p>}
          </div>
          <div className="form-row">
            <label>Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              inputMode="numeric"
              maxLength="10"
              placeholder="Enter 10-digit number"
              autoComplete="off"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {formErrors.phoneNumber && (
              <p className="error">{formErrors.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Cultivator and Amount */}
        <div className="row-two">
          <div className="form-row">
            <label>
              Cultivator<span className="required">*</span>
            </label>
            <div className="image-dropdown">
              <div
                className="dropdown-header"
                onClick={() => {
                  setCultiDropdownOpen(!cultiDropdownOpen);
                  setPaymentDropdownOpen(false);
                }}
              >
                {cultiSelected ? (
                  <img src={cultiSelected.image} alt={cultiSelected.value} />
                ) : (
                  <span className="placeholder">Select Cultivator</span>
                )}
              </div>
              {cultiDropdownOpen && (
                <div className="dropdown-list">
                  {culti_options.map((opt) => (
                    <div
                      key={opt.value}
                      className="dropdown-item"
                      onClick={() => {
                        setCultiSelected(opt);
                        setCultiDropdownOpen(false);
                      }}
                    >
                      <img src={opt.image} alt={opt.value} />
                    </div>
                  ))}
                </div>
              )}
              {formErrors.cultivator && (
                <p className="error">{formErrors.cultivator}</p>
              )}
            </div>
          </div>

          <div className="form-row">
            <label>
              Total Amount<span className="required">*</span>
            </label>
            <MoneyInput
              amount={totalAmount}
              setAmount={setTotalAmount}
              field="totalAmount"
            />
            {formErrors.totalAmount && (
              <p className="error">{formErrors.totalAmount}</p>
            )}
          </div>
        </div>

        {/* Time or Trips */}
        {cultiSelected &&
        ["rotavator", "5tynes", "9tynes", "landLeveler", "discPlough"].includes(
          cultiSelected.value
        ) ? (
          <div className="row-two">
            <div className="form-row">
              <label>Hours</label>
              <input
                type="number"
                min="0"
                max="10"
                value={hours}
                onChange={(e) => setHours(e.target.value || "0")}
                onFocus={(e) => e.target.value === "0" && setHours("")}
                onBlur={(e) => e.target.value === "" && setHours("0")}
              />
            </div>
            <div className="form-row">
              <label>
                Minutes<span className="required">*</span>
              </label>
              <input
                type="number"
                min="0"
                max="60"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value || "0")}
                onFocus={(e) => e.target.value === "0" && setMinutes("")}
                onBlur={(e) => e.target.value === "" && setMinutes("0")}
              />
              {formErrors.time && <p className="error">{formErrors.time}</p>}
            </div>
          </div>
        ) : cultiSelected ? (
          <div className="form-row">
            <label>
              Trips<span className="required">*</span>
            </label>
            <input
              type="number"
              max="20"
              value={noOfTrips}
              onChange={(e) => setNoOfTrips(e.target.value || "0")}
              onFocus={(e) => e.target.value === "0" && setNoOfTrips("")}
              onBlur={(e) => e.target.value === "" && setNoOfTrips("0")}
            />
            {formErrors.trips && <p className="error">{formErrors.trips}</p>}
          </div>
        ) : null}

        {/* Paid Toggle */}
        <div className="form-row">
          <label>Paid?</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={isPaid}
              onChange={() => setIsPaid(!isPaid)}
            />
            <span className="slider" />
          </label>
        </div>

        {/* Payment Fields */}
        {isPaid && (
          <div className="row-two">
            <div className="form-row">
              <label>
                Cash Type<span className="required">*</span>
              </label>
              <div className="image-dropdown">
                <div
                  className="dropdown-header"
                  onClick={() => {
                    setPaymentDropdownOpen(!paymentDropdownOpen);
                    setCultiDropdownOpen(false);
                  }}
                >
                  {paymentSelected ? (
                    <img
                      src={paymentSelected.image}
                      alt={paymentSelected.value}
                    />
                  ) : (
                    <span className="placeholder">Select payment mode</span>
                  )}
                </div>
                {paymentDropdownOpen && (
                  <div className="dropdown-list">
                    {payment_options.map((opt) => (
                      <div
                        key={opt.value}
                        className="dropdown-item"
                        onClick={() => {
                          setPaymentSelected(opt);
                          setPaymentDropdownOpen(false);
                        }}
                      >
                        <img src={opt.image} alt={opt.value} />
                      </div>
                    ))}
                  </div>
                )}
                {formErrors.payment && (
                  <p className="error">{formErrors.payment}</p>
                )}
              </div>
            </div>

            <div className="form-row">
              <label>
                Paid Amount<span className="required">*</span>
              </label>
              <MoneyInput
                amount={paidAmount}
                setAmount={setPaidAmount}
                field="paidAmount"
              />
              {formErrors.paidAmount && (
                <p className="error">{formErrors.paidAmount}</p>
              )}
            </div>
          </div>
        )}

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddForm;
