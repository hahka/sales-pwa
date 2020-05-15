const express = require('express');

const app = express();

app.use(express.static('./dist/sales-pwa-app'));

app.get('/*', (req, res) => res.sendFile('index.html', { root: 'dist/sales-pwa-app/' }));

app.listen(process.env.PORT || 8080);
