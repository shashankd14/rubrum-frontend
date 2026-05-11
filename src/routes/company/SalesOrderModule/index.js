import React, { useCallback } from "react";

const SalesOrderModule = () => {
  const iframeRef = useCallback(
    (node) => {
      if (!localStorage.getItem("userToken") || !iframeRef.current) return;

      if (node !== null) {
        node.onload = () =>
          node?.contentWindow?.postMessage(
            {
              type: "SET_DATA",
              payload: {
                token: localStorage.getItem("userToken") || "",
                refreshToken: localStorage.getItem("refreshToken") || "",
                user: {
                  name: localStorage.getItem("userToken"),
                  id: localStorage.getItem("userId"),
                },
              },
            },
            window.location.origin,
          );
      }
    },
    [localStorage.getItem("userToken")],
  );

  return (
    <iframe
      ref={iframeRef}
      src="/so/sales-order"
      title="Vite App"
      style={{ width: "100%", height: "900px", border: "none" }}
    ></iframe>
  );
};

export default SalesOrderModule;
