import React, { useEffect, useRef } from "react";

const salesModuleUrl = process.env.REACT_APP_SALES_MODULE_BASE_URL;
const salesModuleOrigin = salesModuleUrl ? new URL(salesModuleUrl).origin : '';

const SalesOrderModule = () => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const sendData = () => {
      if (!localStorage.getItem("userToken")) return;
      const contentWindow = iframeRef.current?.contentWindow;
      if (!contentWindow) return;
      contentWindow.postMessage(
        {
          type: "SET_DATA",
          payload: {
            token: localStorage.getItem("userToken") || "",
            refreshToken: localStorage.getItem("refreshToken") || "",
            user: {
              name: localStorage.getItem("userName"),
              id: localStorage.getItem("userId"),
            },
          },
        },
        salesModuleOrigin,
      );
    };

    const handleMessage = (event) => {
      if (event.origin !== salesModuleOrigin) return;
      if (event.data?.type === "APP_READY") {
        sendData();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`${salesModuleUrl}/sales-order`}
      title="Vite App"
      style={{ width: "100%", height: "900px", border: "none" }}
    ></iframe>
  );
};

export default SalesOrderModule;
