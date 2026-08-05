import { useCallback } from "react";
import { getUserToken } from "../../appRedux/sagas/common";

const baseUrl = process.env.REACT_APP_BASE_URL;

const useCheckCustomerBatchNoUnique = () => {
  const checkCustomerBatchNo = useCallback(async (customerBatchId) => {
    const res = await fetch(
      `${baseUrl}api/inwardEntry/isCustomerBatchIdPresent?customerBatchId=${encodeURIComponent(customerBatchId)}`,
      {
        method: "GET",
        headers: { Authorization: getUserToken() },
      }
    );
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return res.json();
  }, []);

  return { checkCustomerBatchNo };
};

export default useCheckCustomerBatchNoUnique;
