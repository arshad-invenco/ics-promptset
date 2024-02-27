import './prompt-video-control.scss'

export function VideoControl(){
    return(
        <div className="ics-video-builder-video-controls">
            <div className="col-md-1">
                <label>Video</label>
                <div className="video-preview">
                </div>
            </div>

            <div className="ics-inline-200-block">
                <label>Classes</label>
                <input type="text" className="ics-input"/>
            </div>

        </div>
    )
}