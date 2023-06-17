import React, { useEffect, useState } from "react";

import "./css/notificationwidget.css";

function NotificationWidget({
  type,
  header,
  subheader,
  body,
  interval,
  close,
}) {
  useEffect(() => {
    if (interval) {
      setTimeout(close, interval);
    }
  }, []);

  console.log(type, header, subheader, body, interval);

  return (
    <div className={`notification-widget flex-column ${type}`}>
      <div className={`background-overlay flex-column`}>
        <div className="notification-widget-head flex-row">
          <div className="notification-widget-head-div flex-column">
            <span>{String(header).toUpperCase()}</span>
            {subheader && subheader.length > 0 ? (
              <span>{String(subheader).toUpperCase()}</span>
            ) : (
              <span></span>
            )}
          </div>
          <button onClick={close}>&times;</button>
        </div>
        <div className="notification-widget-body flex-column">
          {body.map((elems) => elems)}
        </div>
      </div>
    </div>
  );
}

export default NotificationWidget;
