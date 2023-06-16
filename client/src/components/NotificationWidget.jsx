import React, { useEffect, useState } from "react";

import "./css/notificationwidget.css";

function NotificationWidget({ type, msg, interval, close }) {
  const [message, setMessage] = useState([]);
  useEffect(() => {
    if (interval) {
      setTimeout(close, interval);
    }
  }, []);

  return (
    <div className={`notification-widget flex-column ${type}`}>
      <div className={`background-overlay flex-column`}>
        <div className="notification-widget-head flex-row">
          <span>{String(type).toUpperCase()}</span>
          <button onClick={close}>&times;</button>
        </div>
        <div className="notification-widget-body flex-column">
          {msg.map((msgs) => msgs)}
        </div>
      </div>
    </div>
  );
}

export default NotificationWidget;
