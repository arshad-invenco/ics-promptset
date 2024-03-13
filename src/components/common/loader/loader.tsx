import "./loader.scss";

interface GlobalLoaderProps{
  global?:boolean;
}

function Loader({global}:GlobalLoaderProps) {
  return (
    <div className={"ics-loader-container" + (global ? " global-loader" : "")} aria-hidden="false">
      <div className="ics-loader" title="Loading" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
