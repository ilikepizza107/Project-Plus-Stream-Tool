const path = require('path')
const WebSocket = require('ws')

const { app } = require('electron')
// define the main folder
let resourcesPath;
if (app.isPackaged) {
    // Packaged application
    resourcesPath = path.join(process.resourcesPath, 'Resources');
} else {
    // Running with npm/yarn start
    resourcesPath = path.resolve(__dirname, '..', 'Stream Tool', 'Resources');
}
loadExecFile();
async function loadExecFile() {
    try {
        const executable = require(
            path.join(resourcesPath, 'Scripts', 'Executable.js')
        );
        // we pass the WebSocket class because i couldn't figure out a better way to load it there
        // i'm blaming electron on this one
        executable(resourcesPath, __dirname, WebSocket);
    } catch (error) {
        console.log(error);
    }
}
