import './prompt-text-control.scss'
import VerticalAlignCenterRoundedIcon from '@mui/icons-material/VerticalAlignCenterRounded';

export function TextControl() {


    return (
        <div className="ics-prompt-builder-text-controls">

            <div className="ics-inline-250-block">
                <label>Text</label>
                <input type="text" placeholder="Text" className="ics-input"/>
            </div>

            <div className="ics-inline-75-block">
                <label>Color</label>
                <button className="color-picker-button"></button>
            </div>

            <div className="ics-inline-90-block">
                <label>Size</label>
                <input type="number" className="ics-input" min="1" max="380"/>
            </div>

            <div className="ics-inline-250-block">
                <label>Font</label>
                <input type="text" className="ics-input"/>
            </div>

            <div className="ics-inline-150-block">
                <label>Alignment</label>
                <div className="d-flex-row alignment-control">
                    <button className="button-white align">
                        <i className="fas fa-align-left"></i>
                    </button>
                    <button className="button-white align">
                        <i className="fas fa-align-center"></i>
                    </button>
                    <button className="button-white align">
                        <i className="fas fa-align-right"></i>
                    </button>
                </div>
            </div>

            <div className="d-flex-col dimensions">
                <label>Dimensions</label>
                <div className="co-ordinates d-flex-row">
                    <div className="d-flex-row dimension-control">
                        <label>X</label>
                        <input type="number" className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control">
                        <label>Y</label>
                        <input type="number" className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control">
                        <label>W</label>
                        <input type="number" className="ics-input dimension-input"/>
                    </div>

                    <div className="d-flex-row dimension-control disabled-dimension-control">
                        <label>H</label>
                        <input type="number" value={45} className="ics-input dimension-input"/>
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


        </div>
    )
}