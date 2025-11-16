import { Alert } from "antd";
import { useSelector } from "react-redux";
import React from "react";

const ErrorCases = () => {
  const inward = useSelector((state) => state.inward);

  return (
    <>
      {!inward.poDetailsLoading && inward.poDetailsError && (
        <Alert
          banner
          message="Error fetching po details"
          description={
            <>
              Please contact JSW connect, we were not able to fetch PO details
              for the selected location
              <br />
              You can still proceed with manual inward entry.
            </>
          }
          type="error"
          closable
        />
      )}
      {!inward.poDetailsLoading && inward?.poList?.length === 0 && (
        <Alert
          banner
          message="No PO found for the selected location"
          description={
            <>
              Please contact JSW connect, we were not able to find any purchase orders
              for the selected location.
              <br />
              You can still proceed with manual inward entry.
            </>
          }
          type="warning"
          closable
        />
      )}
      {!inward.loadingPoMaterials && inward.errorPoMaterials && (
        <Alert
          banner
          message="Error fetching materials details"
          description={
            <>
              Please contact JSW connect, we were not able to fetch material details
              for the selected PO
              <br />
              You can still proceed with manual inward entry.
            </>
          }
          type="error"
          closable
        />
      )}
    </>
  );
};

export default ErrorCases;
