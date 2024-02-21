import {useEffect, useState} from "react";
import {isAssetHaving} from "../../../services/promptsetService";


export default function AssetsDropdown(props:any) {
    const [assets, setAssets] = useState<string[]>([]);
    console.log(props)

    useEffect(() => {
        fetchAssets();
    }, []);

    function fetchAssets() {
        setAssets(['text', 'image', 'video', 'input']);
        if (props.assignments) {
            console.error('props elements is undefined');
            return;
        }
        const touchMask = isAssetHaving(props.elements, 'text');
        console.log(touchMask)
    }


    return (
        <div className="">
            lskd
            efpldo[efl
            e'rploekorpkierjijerf
            e;fokriomfkporf
            Er'fpleofki
        </div>
    );
}