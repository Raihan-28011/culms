import React, { useState } from "react";

import "./css/motherpage.css";
import { Outlet } from "react-router-dom";
import NotificationWidget from "../components/NotificationWidget";

function MotherPage() {
  const [notify, setNotify] = useState({
    type: "",
    header: "",
    subheader: "",
    body: [],
    interval: undefined,
  });
  const handleNotificationClose = () => {
    setNotify((prev) => {
      return {
        type: "",
        header: "",
        subheader: "",
        body: [],
        interval: undefined,
      };
    });
  };
  return (
    <div className="mother-page">
      {notify.type.length > 0 && notify.body.length > 0 ? (
        <NotificationWidget
          type={notify.type}
          header={notify.header}
          subheader={notify.subheader}
          body={notify.body}
          interval={notify.interval}
          close={handleNotificationClose}
        />
      ) : null}
      <Outlet context={{ notify: notify, setNotify: setNotify }} />
    </div>
  );
}

export default MotherPage;
