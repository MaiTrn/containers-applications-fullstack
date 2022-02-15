import React from "react";

const Notifications = ({ message, notificationType }) => {
  if (message === null) {
    return null;
  }
  return <div className={notificationType}>{message}</div>;
};

export default Notifications;
