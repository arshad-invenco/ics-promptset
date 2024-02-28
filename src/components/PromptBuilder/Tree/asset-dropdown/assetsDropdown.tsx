import {useEffect, useState} from "react";
import isSequoiaDevice, {find, getAsset} from "../../../../services/promptsetService";
import {Assignment} from "../../../../models/promptset.modal";
import {ICON, TEXT} from "../../../../constants/promptSetConstants";

interface AssetsDropdownProps {
    childState: Assignment;
}

export default function AssetsDropdown(props: AssetsDropdownProps) {
    const {childState} = props;
    const [assets, setAssets] = useState<string[]>([]);
    console.log(props, 'AssetsDropdownProps')

    useEffect(() => {
        fetchAssets();
    }, []);

    function fetchAssets() {
        setAssets(['text', 'image', 'video', 'input']);
        const touchMask = !!childState.touchmap;
        const bg = find(childState.elements, 'bg');

        if (isSequoiaDevice("G7-100-8") && touchMask)
            setAssets(prevAssets => [...prevAssets, 'area']);
        else if (isSequoiaDevice("G7-100") && !touchMask)
            setAssets(prevAssets => [...prevAssets, 'touchmask']);
        if (!bg?.lock)
            setAssets(prevAssets => ['bg', ...prevAssets]);
    }


    function handleAdd(childState: Assignment) {
        console.log(childState, 'handleAdd')
    }

    return (
        <>
            {assets.map((asset: string, index: number) => {
                return (
                    <div key={index} className="asset-item" onClick={() => handleAdd(childState)}>
                        <div className="dropdown-icon">
                            <i className={getAsset(asset, ICON)}></i>
                        </div>
                        <div className="dropdown-text">
                            {getAsset(asset, TEXT)}
                        </div>
                    </div>
                )
            })}
        </>

    );
}