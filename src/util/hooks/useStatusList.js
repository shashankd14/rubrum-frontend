import { useState, useCallback } from "react";
import { getUserToken } from "../../appRedux/sagas/common";

const baseUrl = process.env.REACT_APP_BASE_URL;

const useStatusList = () => {
  const [loading, setLoading] = useState(false);
  const [statusList, setStatusList] = useState([]);
  const [error, setError] = useState(null);

  const fetchStatusList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}api/status/list`, {
        method: "GET",
        headers: { Authorization: getUserToken() },
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setStatusList(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchStatusList, statusList, loading, error };
};

export default useStatusList;
