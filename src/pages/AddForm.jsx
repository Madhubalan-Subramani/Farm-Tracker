import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/setup";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { culti_options, payment_options } from "../utils/cultiOptionImage";
import NameInput from "../components/Form/NameInput";
import PhoneInput from "../components/Form/PhoneInput";
import DateInput from "../components/Form/DateInput";
import TimeInput from "../components/Form/TimeInput";
import RoundsInput from "../components/Form/RoundsInput";
import MoneyInput from "../components/Form/MoneyInput";
import NotesInput from "../components/Form/NotesInput";
import SubmitButton from "../components/Form/SubmitButton";
import ImageDropdown from "../components/Form/ImageDropdown";
import PaidSection from "../components/Form/PaidSection";
import { useLocation } from "react-router-dom";
import "./AddForm.css";

import { getFormData, addFormValidation } from "../utils/addFormValidation";

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
  const [notes, setNotes] = useState("");
  const [allNames, setAllNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);

  const location = useLocation();
  const editData = location.state?.editData || null;
  const isEdit = location.state?.isEdit || false;

  useEffect(() => {
    const fetchNames = async () => {
      const userRef = collection(db, "users", auth.currentUser.uid, "userData");
      const snapshot = await getDocs(userRef);
      const names = snapshot.docs.map((doc) => doc.data().name).filter(Boolean);
      setAllNames([...new Set(names)]); // remove duplicates
    };

    fetchNames();
  }, []);

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setPhoneNumber(editData.phone_number || "");
      setDate(editData.date || new Date().toISOString().split("T")[0]);

      const cultiObj = culti_options.find(
        (opt) => opt.value === editData.cultivator_type
      );
      setCultiSelected(cultiObj || null);

      setHours(editData?.time_used?.hours?.toString() || "0");
      setMinutes(editData?.time_used?.minutes?.toString() || "0");
      setNoOfTrips(editData?.trips?.toString() || "0");

      setTotalAmount(editData.total_amount?.toString() || "0");

      setIsPaid(editData.is_paid || true);

      const paymentObj = payment_options.find(
        (opt) => opt.value === editData.mode_of_payment
      );
      setPaymentSelected(paymentObj || null);

      setPaidAmount(editData.paid_amount?.toString() || "0");

      setNotes(editData.notes || "");
    }
  }, [editData]);

  const handleNameChange = (value) => {
    setName(value);
    const suggestions = allNames.filter((n) =>
      n.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNames(suggestions);
  };

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
      notes,
    });

    const errors = addFormValidation(formData);
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
      mode_of_payment: formData.modeOfPayment || null,
      paid_amount: parseFloat(formData.paidAmount) || 0,
      modeofpayment_image: selectedPayment?.image || null,
      posting_time: serverTimestamp(),
      cultivator_type_image: selectedCultivator?.image || null,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      status: "active",
      notes: notes,
    };

    try {
      const userRef = collection(db, "users", auth.currentUser.uid, "userData");
      if (isEdit && editData?.id) {
        const docRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "userData",
          editData.id
        );
        await updateDoc(docRef, {
          ...cleanedData,
          updated_at: serverTimestamp(),
        });
        alert("Data updated successfully!");
      } else {
        await addDoc(userRef, cleanedData);
        alert("Data submitted successfully!");
      }
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
    setNotes("");
  };

  const isTimeBased = [
    "rotavator",
    "5tynes",
    "9tynes",
    "landLeveler",
    "discPlough",
  ].includes(cultiSelected?.value);

  const isRoundBased = [
    "dumpTrailer",
    "waterTanker",
    "tractor",
  ].includes(cultiSelected?.value);

  return (
    <div className="add-form-page">
      <form className="form-card" onSubmit={handleSubmit}>
        {isEdit ? <h2>Update Existing Record</h2> : <h2>Add New Record</h2>}

        <NameInput
          name={name}
          setName={handleNameChange}
          error={formErrors.name}
          suggestions={filteredNames}
          onSuggestionClick={(value) => {
            setName(value);
            setFilteredNames([]);
          }}
        />

        {/* Date and Phone */}
        <div className="row-two">
          <DateInput date={date} setDate={setDate} error={formErrors.date} />
          <PhoneInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            error={formErrors.phoneNumber}
          />
        </div>

        {/* Cultivator and Amount */}
        <div className="row-two">
          <ImageDropdown
            label="Cultivator"
            selected={cultiSelected}
            setSelected={setCultiSelected}
            dropdownOpen={cultiDropdownOpen}
            setDropdownOpen={setCultiDropdownOpen}
            options={culti_options}
            placeholder="Select Cultivator"
            error={formErrors.cultivator}
          />

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
        {isTimeBased ? (
          <TimeInput
            hours={hours}
            setHours={setHours}
            minutes={minutes}
            setMinutes={setMinutes}
            error={formErrors.time}
          />
        ) : isRoundBased ? (
          <RoundsInput
            noOfTrips={noOfTrips}
            setNoOfTrips={setNoOfTrips}
            error={formErrors.trips}
          />
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

        {/* Payment Section */}
        {isPaid && (
          <div className="row-two">
            <PaidSection
              paymentSelected={paymentSelected}
              setPaymentSelected={setPaymentSelected}
              paymentDropdownOpen={paymentDropdownOpen}
              setPaymentDropdownOpen={setPaymentDropdownOpen}
              paidAmount={paidAmount}
              setPaidAmount={setPaidAmount}
              formErrors={formErrors}
              payment_options={payment_options}
            />
          </div>
        )}

        {/* Notes with Mic */}
        <NotesInput notes={notes} setNotes={setNotes} />

        <SubmitButton isEdit={isEdit} />
      </form>
    </div>
  );
};

export default AddForm;
