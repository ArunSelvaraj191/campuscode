import React from "react";

const Spinner = ({
  size = "large",
  label = "Loading...",
  ariaLive = "polite",
}) => {
  const className = `spinner ${
    size === "small" ? "spinner--small" : ""
  }`.trim();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
      aria-live={ariaLive}
    >
      <div
        className={className}
        role="status"
        aria-hidden={label ? "false" : "true"}
      />
      {label ? <div className="spinner__label">{label}</div> : null}
    </div>
  );
};

export default Spinner;
