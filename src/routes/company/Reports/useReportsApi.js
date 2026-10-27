import { useState, useCallback } from "react";
import { getUserToken } from "../../../appRedux/sagas/common";

const baseUrl = process.env.REACT_APP_BASE_URL;

const useGetReportCards = () => {
    const [loading, setLoading] = useState(false);
    const [statusList, setStatusList] = useState([]);
    const [error, setError] = useState(null);

    const fetchReportCards = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${baseUrl}api/reports/kpi`, {
                method: "POST",
                headers: { Authorization: getUserToken(), "Content-Type": "application/json" },
                body: JSON.stringify({
                    toDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
                    fromDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // 30 days ago in YYYY-MM-DD format
                    locationId: '',
                }),
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

    return { fetchReportCards, reportsData: statusList, loading, error };
};

export default useGetReportCards;
