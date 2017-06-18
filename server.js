const Express = require('express');


const PORT = process.env.PORT || 3000;
const App = Express();

App.use(Express.static('public'));

const server = App.listen(PORT, ()=>console.log("listening on port", PORT));

require('./socket.js')(server);
