const server = require('./server');

const port = 5000;
server.listen(port, () => console.log(`\ Listening on http://localhost:${port} \n`));