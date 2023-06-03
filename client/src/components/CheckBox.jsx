import React, { useEffect, useState } from "react";

import "./css/checkbox.css";

function CheckBox(props) {
  const { checked, onChange, circle } = props;
  const [check, setCheck] = useState(checked);

  useEffect(() => {
    if (checked) setCheck(true);
    else setCheck(false);
  }, [checked]);

  return (
    <div
      className="check-box"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
        setCheck((prev) => !prev);
      }}
      style={{
        border: !check
          ? "1px solid var(--color-gray1-100)"
          : "1px solid transparent",
        borderRadius: circle ? "50%" : "var(--b-radius2)",
      }}
    >
      <span
        className="checkmark"
        style={{
          backgroundImage:
            check && !circle
              ? 'url("/rectangleCheckbox.svg")'
              : check && circle
              ? 'url("/circleCheckbox.svg")'
              : "",
          borderRadius: circle ? "50%" : "var(--b-radius2)",
        }}
      ></span>
    </div>
  );
}

export default CheckBox;
