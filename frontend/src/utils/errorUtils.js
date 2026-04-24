import { toast } from 'react-toastify';

/**
 * Parses backend validation errors and maps them to form fields
 * @param {Error} err - The error object from axios
 * @param {Function} setErrors - Formik/React-Hook-Form setErrors function
 * @returns {string} - The primary error message
 */
export const handleBackendErrors = (err, setErrors = null) => {
  const responseData = err.response?.data;
  const primaryMessage = responseData?.error?.message || responseData?.message || err.message || "An unexpected error occurred";
  
  const details = responseData?.error?.details;
  
  if (details && Array.isArray(details) && setErrors) {
    const fieldErrors = {};
    details.forEach(detail => {
      // Joi returns path as an array [ "fieldName" ]
      const field = Array.isArray(detail.path) ? detail.path[0] : detail.field;
      if (field) {
        fieldErrors[field] = detail.message;
      }
    });
    
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
    }
  }

  return primaryMessage;
};

/**
 * Displays a toast for the error and handles field-level errors if applicable
 */
export const toastBackendError = (err, setErrors = null) => {
  const message = handleBackendErrors(err, setErrors);
  toast.error(message);
  return message;
};
