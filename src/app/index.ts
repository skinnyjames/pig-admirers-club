import express from "express";
import path from "path";
import setup from "./models/setup"

const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // check for first installation
  setup.setupRequired()
  .then((bool: boolean) => {
    if (bool) {
      res.sendFile(path.join(__dirname, 'html', 'setup.html'))
    } else {
      res.sendFile(path.join(__dirname, 'html', 'index.html'))
    }
  })
});

app.listen(port, () => {
  console.log( `server started at ${port}`);
});