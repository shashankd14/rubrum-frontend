import React, { useCallback} from 'react';

const ConsolidatedPlans = () => {
  const iframeRef = useCallback((node) => {
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
          "/so/consolidated-plan",
        );
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={
       "/so/consolidated-plan"
      }
      title="Vite App"
      style={{ width: "100%", height: "900px", border: "none" }}
    ></iframe>
  );
};

export default ConsolidatedPlans;