const express = require('express');
const app = express();
const portNumber = process.env.REACT_APP_PRD_PORT;
const sourceDir = 'public';

app.use(express.static(sourceDir));

app.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
  console.log(`Serving content from /${sourceDir}/`);
});
