
import React, {useEffect} from 'react';

const SalesOrderModule = ({ match }) => {
    useEffect(() => {
    const script = document.createElement('script');
    script.src = '/bootstrap.js';
    script.onload = () => {
      if (window.mountNextApp) {
        window.mountNextApp('next-container');
      } else {
        console.error('mountNextApp is not defined on window');
      }
    };
    document.body.appendChild(script);
  }, []);

    return (
        <div id="next-container"></div>
    )
}

export default SalesOrderModule;