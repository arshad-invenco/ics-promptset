import {useLocation} from "react-router-dom";


export const useReadOnly = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    return params.get('readOnly') === 'true';
};