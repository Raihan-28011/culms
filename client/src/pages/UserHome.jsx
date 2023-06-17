import React, { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useOutletContext } from "react-router-dom";
import formatDistance from "date-fns/formatDistance";

import "./css/userhome.css";

function NotificationVaultWidget(props) {
  const { notify } = props;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (notify.type.length > 0 && notify.body.length > 0 && notify.interval) {
      notify.time = new Date();
      setNotifications((prev) => [...prev, notify]);
    }
  }, [notify]);
  return (
    <div className={`notification-vault-widget flex-column ${props.className}`}>
      <label>Notifications</label>
      <div className="notification-vault-widget-body">
        {notifications.map((val) => {
          return (
            <div className={`flex-column ${val.type}`}>
              <div className={`background-overlay flex-column`}>
                <div className="notification-widget-head flex-row">
                  <div className="notification-widget-head-div flex-column">
                    <span>{String(val.header).toUpperCase()}</span>
                    {val.subheader && val.subheader.length > 0 ? (
                      <span>{String(val.subheader).toUpperCase()}</span>
                    ) : (
                      <span></span>
                    )}
                  </div>
                  <span>{formatDistance(val.time, new Date())} ago</span>
                </div>
                <div className="notification-widget-body flex-column">
                  {val.body.map((elems) => elems)}
                </div>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 ? <div className="empty">Empty</div> : null}
      </div>
      <button onClick={() => setNotifications([])}>
        Clear all notifications
      </button>
    </div>
  );
}

function LogoutWidget(props) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.pathname = "/";
  };
  return (
    <div className={`logout-widget flex-column ${props.className}`}>
      <div className="user-info flex-row">
        <div
          className="user-info-left flex-row"
          style={{
            backgroundColor: `var(--color${(Number(props.uid) % 5) + 1}-100)`,
          }}
        >
          <span>{props.name[0]}</span>
        </div>
        <div className="user-info-right flex-column">
          <span>{props.name}</span>
          <span>
            <a href={`mailto:${props.email}`}>{props.email}</a>
          </span>
        </div>
      </div>
      <div className="logout-widget-row flex-row" onClick={handleLogout}>
        <img src="/logout_logo.svg" />
        <span>Logout</span>
      </div>
      <div className="logout-widget-row flex-row">
        <img src="/settings_logo.svg" />
        <span>Settings</span>
      </div>
    </div>
  );
}

function UserNavbar(props) {
  const { uid, name, email, notify } = props;
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [bellRang, setBellRang] = useState(false);

  useEffect(() => {
    const handleMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }

      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (notify.body.length > 0 && notify.interval) {
      setBellRang(true);
    }
  }, [notify]);

  return (
    <div className="user-navbar flex-row">
      <div className="user-nav-left">
        <Link to={`/users/${uid}`}>
          <img src="/culms_logo.png" alt="culms-logo" />
        </Link>
      </div>
      <div className="user-nav-middle">
        <input type="search" placeholder="search" />
      </div>
      <div className="user-nav-right flex-row">
        <div
          className="notification-bell flex-row"
          ref={notifRef}
          onClick={() => {
            setBellRang(false);
            setNotifOpen((prev) => !prev);
          }}
        >
          <button>
            <img
              src={
                bellRang
                  ? "/notification_bell_rang.svg"
                  : "/notification_bell.svg"
              }
              alt=""
            />
          </button>
          <NotificationVaultWidget
            className={notifOpen ? "open" : "close"}
            notify={notify}
          />
        </div>
        <div className="user-nav-right-left flex-column">
          <span>{name}</span>
          <span>
            <a href={`mailto:${email}`}>{email}</a>
          </span>
        </div>
        <div
          className="user-nav-right-right"
          ref={menuRef}
          onClick={() => setOpen((prev) => !prev)}
        >
          <div
            className="user-profile flex-row"
            style={{
              backgroundColor: `var(--color${(Number(uid) % 5) + 1}-100)`,
            }}
          >
            <span>{name[0]}</span>
          </div>
          <LogoutWidget
            className={open ? "open" : "close"}
            name={name}
            email={email}
            uid={uid}
          />
        </div>
      </div>
    </div>
  );
}

function UserSidebar() {
  const handleOptionClick = (e) => {
    const elem = e.currentTarget;
    const curSelected = document.querySelector(".current-selected");
    if (!elem.classList.contains("current-selected")) {
      elem.classList.add("current-selected");
      curSelected.classList.remove("current-selected");
    }
  };

  return (
    <div className="user-sidebar flex-column">
      <div
        className="user-sidebar-option flex-row current-selected"
        onClick={handleOptionClick}
      >
        <span>Dashboard</span>
      </div>
      <div className="user-sidebar-option flex-row" onClick={handleOptionClick}>
        <span>Tasks</span>
      </div>
      <div className="user-sidebar-option flex-row" onClick={handleOptionClick}>
        <span>Calendar</span>
      </div>
    </div>
  );
}

function UserHome() {
  const { notify, setNotify } = useOutletContext();
  const [uid, setUid] = useState();
  const [user, setUser] = useState();
  const location = useLocation();

  useEffect(() => {
    const usr = JSON.parse(localStorage.getItem("user"));
    setUser(usr);
    setUid(usr.u_id);
  }, []);

  return (
    <div className="user-home">
      {user && uid && (
        <UserNavbar
          uid={uid}
          name={user.name}
          email={user.email}
          notify={notify}
        />
      )}

      {/* <UserSidebar /> */}
      <Outlet context={{ notify: notify, setNotify: setNotify }} />
    </div>
  );
}

export default UserHome;
