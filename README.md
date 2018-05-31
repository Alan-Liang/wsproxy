wsproxy
=====
![Code Style:Really Bad](https://alan.liangcn.ml/CodeStyle.svg)

HTTP Proxy over WebSockets

# Install
```bash
git clone https://github.com/Alan-Liang/wsproxy.git
cd wsproxy
npm i
```
# Usage
You need to install this **both** on the server and the client. On the server, set the port to listen in the `port` variable and run `node server.js` or `npm start`. On the client, change `wsLoc` to the WebSocket server's address, `port` to the proxy port and run `node client.js`. Then, setup your device's http proxy.