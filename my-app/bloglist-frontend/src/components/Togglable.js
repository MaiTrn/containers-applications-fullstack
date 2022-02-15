import React, { useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const styles = {
    hideWhenVisible: { display: visible ? "none" : "" },
    showWhenVisible: { display: visible ? "" : "none" },
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      <div style={styles.hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={styles.showWhenVisible}>
        {props.children}
        <button style={{ marginLeft: "60px" }} onClick={toggleVisibility}>
          Cancel
        </button>
      </div>
    </div>
  );
});

Togglable.displayName = "Togglable";
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
