import { useCallback } from "react";
import { getUserToken } from "../../appRedux/sagas/common";

const baseUrl = process.env.REACT_APP_BASE_URL;

const useCheckCoilNumberUnique = () => {
  const checkCoilNumber = useCallback(async (coilNumber) => {
    const res = await fetch(
      `${baseUrl}api/inwardEntry/isCoilPresent?coilNumber=${encodeURIComponent(coilNumber)}`,
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

  return { checkCoilNumber };
};

export default useCheckCoilNumberUnique;
