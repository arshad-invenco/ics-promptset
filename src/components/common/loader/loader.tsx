import "./loader.scss";

function Loader() {
  return (
    <div className="ics-loader-container" aria-hidden="false">
      <div className="ics-loader" title="Loading" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
