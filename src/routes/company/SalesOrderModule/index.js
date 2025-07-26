import { refresh } from 'less';
import React, {useEffect, useCallback} from 'react';

const SalesOrderModule = () => {

//   const sendDataToIframe = () => {
//     const message = {
//       type: 'SET_DATA',
//       payload: {
//         token: 'abc123',
//         user: { name: 'Pragati' },
//       },
//     };
//   if (iframeRef.current?.contentWindow) {
//     iframeRef?.current?.contentWindow?.postMessage(message, 'http://localhost:5173');
//   }
// };

 
const iframeRef = useCallback((node) => {
    if (node !== null) {
console.log('iframeRef', node);
        node.onload = () => node?.contentWindow?.postMessage({
      type: 'SET_DATA',
      payload: {
        token: localStorage.getItem('userToken') || '',
        refreshToken: localStorage.getItem('refreshToken') || '',
        user: { name: localStorage.getItem('userToken'), id: localStorage.getItem('userId') },
      },
    }, 'http://localhost:5173');
    }
}, [])


  //   useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = '/sales/index.html';
  //   script.onload = () => {
  //     if (window.mountNextApp) {
  //       window.mountNextApp('next-container');
  //     } else {
  //       console.error('mountNextApp is not defined on window');
  //     }
  //   };
  //   document.body.appendChild(script);
  // }, []);

    return (
      <iframe
        ref={iframeRef}
        src="http://localhost:5173/sales-order"
        title="Vite App"
        style={{ width: '100%', height: '900px', border: 'none' }}
      ></iframe>
    )
}

export default SalesOrderModule;