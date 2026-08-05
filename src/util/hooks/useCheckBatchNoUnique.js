import { useState, useCallback } from "react";
import { getUserToken } from "../../appRedux/sagas/common";

const baseUrl = process.env.REACT_APP_BASE_URL;

const useCheckBatchNoUnique = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const checkBatchNo = useCallback(async (batchNumber) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${baseUrl}api/inwardEntry/isBatchNoPresent?batchNumber=${encodeURIComponent(batchNumber)}`,
        {
          method: "GET",
          headers: { Authorization: getUserToken() },
        }
      );
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const isPresent = await res.json();
      setResponse(isPresent);
      return isPresent;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { checkBatchNo, loading, response, error };
};

export default useCheckBatchNoUnique;
