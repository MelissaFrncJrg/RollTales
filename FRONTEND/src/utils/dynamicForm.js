import { useState } from "react";

const useStyleInput = (initialState) => {
  const [values, setValues] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const hasContent = (name) => values[name]?.trim() !== "";

  return [values, handleChange, hasContent];
};

export default useStyleInput;
