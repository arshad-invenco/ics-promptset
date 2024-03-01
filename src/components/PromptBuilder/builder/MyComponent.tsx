import React, { useEffect, useRef } from 'react';

const MyComponent = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        if (svgRef.current) {
            var s = window.Snap(svgRef.current);
            s.circle(100,100,50).attr({ fill: 'yellow' });
            console.log(s.getBBox(), 'bbox')

        }
    }, []);

    return <svg ref={svgRef} id="svgout" />;
};

export default MyComponent;