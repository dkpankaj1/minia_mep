import { useState, useCallback } from 'react';
import axios from 'axios';

const useDownloadFile = (url, filename) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const downloadFile = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(url, {
                responseType: 'blob', // important for binary data
            });

            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', filename); // or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [url, filename]);

    return { isLoading, error, downloadFile };
};

export default useDownloadFile;
