import './prompt-image-control.scss'
import VerticalAlignCenterRoundedIcon from "@mui/icons-material/VerticalAlignCenterRounded";

export function ImageControl() {
    return (
        <div className="ics-prompt-builder-image-controls d-flex-row">
            <div className="col-md-1">
                <label>Image</label>
                <div className="image-preview">
                </div>
            </div>

            <div className="d-flex-col dimensions">
                <label>Dimensions</label>
                <div className="co-ordinates d-flex-row">
                    <div className="d-flex-row dimension-control">
                        <label>X</label>
                        <input type="number" min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control">
                        <label>Y</label>
                        <input type="number" min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control disabled-control">
                        <label>W</label>
                        <input type="number" min={0} className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control disabled-control">
                        <label>H</label>
                        <input type="number" min={0} value={45} className="ics-input dimension-input"/>
                    </div>
                </div>
            </div>


            <div className="ics-inline-150-block">
                <label>Center shift</label>
                <div className="d-flex-row center-shift">
                    <label className="shift-btn">
                        <VerticalAlignCenterRoundedIcon className="icon shift-icon-transform-horizontal"/>
                    </label>
                    <label className="shift-btn">
                        <VerticalAlignCenterRoundedIcon className="icon"/>
                    </label>
                </div>
            </div>

            {/*TODO: add if condition left */}
            <div className="ics-inline-200-block">
                <label>Classes</label>
                <input type="text" className="ics-input"/>
            </div>
        </div>
    )
}