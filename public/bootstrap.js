// next-app/public/bootstrap.js

window.mountNextApp = function (containerId) {
  const iframe = document.createElement('iframe');
  iframe.src = 'http://localhost:3001/inward-list-plan'; // Your Next app’s URL
  iframe.style = "width: 100%; height: 100%; border: none;";
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = ''; // Clear if already mounted
    container.appendChild(iframe);
  } else {
    console.error(`No element with id ${containerId} found`);
  }
};
