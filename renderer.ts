import { ipcRenderer } from "electron";
// import * as path from "path";

const downloadBtnEl = document.querySelector('#download');
const startBtnEl = document.querySelector('#node-start');
const stopBtnEl = document.querySelector('#node-stop');

ipcRenderer.on('is-node-downloaded', (event, props) => {
  if(props.status === true) {
    downloadBtnEl.setAttribute('disabled', 'true');
  } else {
    downloadBtnEl.removeAttribute('disabled');
  }

  stopBtnEl.setAttribute('disabled', 'true');
  startBtnEl.removeAttribute('disabled');
});

downloadBtnEl.addEventListener('click', () => {
  downloadBtnEl.setAttribute('disabled', 'true');
  ipcRenderer.send('node-download');
});

startBtnEl.addEventListener('click', () => {
  startBtnEl.setAttribute('disabled', 'true');
  stopBtnEl.removeAttribute('disabled');
  ipcRenderer.send('node-start');
});

stopBtnEl.addEventListener('click', () => {
  stopBtnEl.setAttribute('disabled', 'true');
  startBtnEl.removeAttribute('disabled');
  ipcRenderer.send('node-stop');
});

ipcRenderer.send('get-node-downloaded');
