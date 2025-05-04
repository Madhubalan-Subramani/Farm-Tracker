import React, { useState } from "react";
import PaymentNameSection from "../components/Payment/PaymentNameSection";
import PaymentAmountSection from "../components/Payment/PaymentAmountSection";
import PaidSection from "../components/Form/PaidSection";
import DateInput from "../components/Form/DateInput";
import { payment_options } from "../utils/cultiOptionImage";
import useUserData from "../hooks/useUserData";
import calculatePayments from "../utils/calculatePayment";
import { validatePaymentForm } from "../utils/validatePaymentForm";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase/setup";

const AddPayment = () => {
  const { data: allData, loading } = useUserData();

  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [totalRecord, setTotalRecord] = useState("0");
  const [matchedRecordsTotalAmount, setMatchedRecordsTotalAmount] = useState("0");
  const [matchedRecordsBalanceAmount, setMatchedRecordsBalanceAmount] = useState("0");
  const [matchedRecordsPaidAmount, setMatchedRecordsPaidAmount] = useState("0");
  const [paymentSelected, setPaymentSelected] = useState(null);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [filteredNames, setFilteredNames] = useState([]);
  const [unpaidCount, setUnpaidCount] = useState(0);

  const handleNameChange = (value) => {
    setName(value);
    const suggestions =[...new Set(allData
      .map((data) => data.name)
      .filter((n) => n.toLowerCase().includes(value.toLowerCase()))
    )];
    setFilteredNames(suggestions);
  };

  const handleSearchClick = () => {
    if (!name.trim()) return;

    const matchedRecords = allData.filter(
      (record) => record.name.toLowerCase() === name.toLowerCase()
    );

    const unpaidRecords = matchedRecords.filter(
      (entry) => entry.total_amount !== entry.paid_amount
    );

    setTotalRecord(matchedRecords.length);
    setUnpaidCount(unpaidRecords.length);

    const { totalAmount, balanceAmount } = calculatePayments(matchedRecords);

    setMatchedRecordsTotalAmount(totalAmount);
    setMatchedRecordsBalanceAmount(balanceAmount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validatePaymentForm({
      name,
      date,
      paidAmount: matchedRecordsPaidAmount,
      paymentSelected,
      allData,
    });

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const paidAmountFloat = parseFloat(matchedRecordsPaidAmount);
    let remainingToPay = paidAmountFloat;

    // Filter and sort unpaid records
    let unpaidRecords = allData
      .filter(
        (record) =>
          record.name.toLowerCase() === name.toLowerCase() &&
          record.total_amount > record.paid_amount
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Prepare updated records
    let updatedRecords = [];

    for (let record of unpaidRecords) {
      if (remainingToPay <= 0) break;

      const due = record.total_amount - record.paid_amount;
      const amountToAdd = Math.min(remainingToPay, due);
      const newPaidAmount = record.paid_amount + amountToAdd;

      updatedRecords.push({
        ...record,
        paid_amount: newPaidAmount,
        is_paid: newPaidAmount >= record.total_amount,
        mode_of_payment: paymentSelected?.value || "",
        modeofpayment_image: paymentSelected?.image || "",
        updated_at: new Date().toISOString(),
      });

      remainingToPay -= amountToAdd;
    }

    // Firebase update
    try {
      const updatePromises = updatedRecords.map((record) => {
        const recordRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "userData",
          record.id
        );
        return updateDoc(recordRef, {
          paid_amount: record.paid_amount,
          is_paid: record.is_paid,
          mode_of_payment: record.mode_of_payment,
          modeofpayment_image: record.modeofpayment_image,
          updated_at: record.updated_at,
        });
      });

      await Promise.all(updatePromises);

      alert("Payment updated successfully!");

      // Optional: Reset form
      setName("");
      setMatchedRecordsPaidAmount("0");
      setPaymentSelected(null);
      setTotalRecord("0");
      setUnpaidCount(0);
      setMatchedRecordsTotalAmount("0");
      setMatchedRecordsBalanceAmount("0");
      setFilteredNames([]);
    } catch (error) {
      alert("Something went wrong while updating payment.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="add-form-page">
      <form
        className="form-card"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      >
        <h2>Payment Form</h2>

        <PaymentNameSection
          name={name}
          setName={handleNameChange}
          filteredNames={filteredNames}
          setFilteredNames={setFilteredNames}
          handleSearchClick={handleSearchClick}
          formErrors={formErrors}
        />

        <div className="row-two">
          <DateInput date={date} setDate={setDate} error={formErrors.date} />

          <div className="form-row" style={{ width: "20%" }}>
            <label>Total Records</label>
            <input
              type="text"
              value={totalRecord}
              readOnly
              style={{ cursor: "not-allowed" }}
            />
          </div>
          <div className="form-row" style={{ width: "20%" }}>
            <label>Unpaid Records</label>
            <input
              type="text"
              value={unpaidCount}
              readOnly
              style={{ cursor: "not-allowed" }}
            />
          </div>
        </div>

        <PaymentAmountSection
          matchedRecordsTotalAmount={matchedRecordsTotalAmount}
          matchedRecordsBalanceAmount={matchedRecordsBalanceAmount}
          setMatchedRecordsTotalAmount={setMatchedRecordsTotalAmount}
          setMatchedRecordsBalanceAmount={setMatchedRecordsBalanceAmount}
        />

        <div className="row-two">
          <PaidSection
            paymentSelected={paymentSelected}
            setPaymentSelected={setPaymentSelected}
            paymentDropdownOpen={paymentDropdownOpen}
            setPaymentDropdownOpen={setPaymentDropdownOpen}
            paidAmount={matchedRecordsPaidAmount}
            setPaidAmount={setMatchedRecordsPaidAmount}
            formErrors={formErrors}
            payment_options={payment_options}
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddPayment;
