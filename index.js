const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const myVar = process.env.CUSTOM_MESSAGE || "Default setup";

app.get('/', (req, res) => res.send(`<h1>SWE40006 Credit App</h1><p>Message: ${myVar}</p>`));
app.listen(port, () => console.log('Server running!'));