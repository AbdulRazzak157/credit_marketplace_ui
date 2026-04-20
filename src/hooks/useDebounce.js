import { useState, useEffect } from "react";

function useDebounce(value, delay = 800) {

    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup timeout if value changes before delay
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;
