import React, { useCallback } from "react";

const SalesOrderModule = () => {
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
          "https://app.workeazy.in/so",
        );
    },
    [],
  );

  return (
    <iframe
      ref={iframeRef}
      src="https://app.workeazy.in/so/sales-order"
      title="Vite App"
      style={{ width: "100%", height: "900px", border: "none" }}
    ></iframe>
  );
};

export default SalesOrderModule;
