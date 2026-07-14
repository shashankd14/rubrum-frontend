import React, { useCallback } from "react";

const salesModuleUrl = process.env.REACT_APP_SALES_MODULE_BASE_URL;

const SalesOrderModule = () => {
  console.log("salesModuleUrl", salesModuleUrl);
  const iframeRef = useCallback(
    (node) => {
      if (!localStorage.getItem("userToken") || !node) return;

      node.onload = () =>
        node?.contentWindow?.postMessage(
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
          salesModuleUrl,
        );
    },
    [],
  );

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
