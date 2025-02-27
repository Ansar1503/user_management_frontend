import {  userData } from "../../types/interfaces";
import { SignInData, SignUpData } from "../../types/types";

let validEmailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
let validPasswordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
let validPhoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

export const validateSignIn = (data: SignInData) => {
  const errors: Partial<Record<keyof SignInData, string>> = {};

  if (!data.email.trim()) {
    errors.email = "Please provide your email address.";
  } else if (!validEmailRegex.test(data.email)) {
    errors.email = "Enter a valid email address, e.g., name@example.com.";
  }

  if (!data.password.trim()) {
    errors.password = "Please enter your password.";
  } else if (!validPasswordRegex.test(data.password)) {
    errors.password =
      "Password must be 6-16 characters and include at least one number and one special character (e.g., @, #, $, etc.).";
  }

  return errors;
};

export const validateSignUp = (data: SignUpData) => {
  const errors: Partial<Record<keyof SignUpData, string>> = {};

  if (!data.fname.trim()) {
    errors.fname = "Please provide your first name.";
  }

  if (!data.lname.trim()) {
    errors.lname = "Please provide your last name.";
  }

  if (!data.email.trim()) {
    errors.email = "Please provide your email address.";
  } else if (!validEmailRegex.test(data.email)) {
    errors.email = "Enter a valid email address, e.g., name@example.com.";
  }

  if (!data.phone.trim()) {
    errors.phone = "Please provide your phone number.";
  } else if (!validPhoneRegex.test(data.phone)) {
    errors.phone = "Invalid phone number. Format: (123) 456-7890 or similar.";
  }

  if (!data.role.trim()) {
    errors.role = "Please select a role.";
  }

  if (!data.password.trim()) {
    errors.password = "Please enter your password.";
  } else if (!validPasswordRegex.test(data.password)) {
    errors.password =
      "Password must be 6-16 characters and include at least one number and one special character (e.g., @, #, $, etc.).";
  }

  return errors;
};

export const validateProfile = (data: Partial<userData>) => {
  const errors: Partial<Record<keyof userData, string>> = {};

  if (!data.fname?.trim()) {
    errors.fname = 'First name is required';
    return errors
  }

  if (!data.lname?.trim()) {
    errors.lname = 'Last name is required';
    return errors
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
    return errors
  } else if (!validEmailRegex.test(data.email)) {
    errors.email = 'Please enter a valid email address';
    return errors
  }

  if (data.phone && !validPhoneRegex.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
    return errors
  }


  if (data.address && data.address.trim().length < 5) {
    errors.address = 'Address must be at least 5 characters long';
    return errors
  }

  if (data.designation && data.designation.trim().length < 3) {
    errors.designation = 'Designation must be at least 3 characters long';
    return errors
  }

  if (data.companyName && data.companyName.trim().length < 3) {
    errors.companyName = 'Company name must be at least 3 characters long';
    return errors
  }


  if (data.dateOfBirth) {
    const dob = new Date(data.dateOfBirth);
    const currentDate = new Date();
    if (dob > currentDate) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
      return errors
    }
  }

  return errors;
};

