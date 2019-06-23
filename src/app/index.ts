import express from "express";
import path from "path";
import setup from "./models/setup"
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import setupRoutes from './routes/setup'
import artistRoutes from './routes/artists'
import conceptRoutes from './routes/concepts'
import authMiddleware from './middleware/auth'

const app = express();
const port = 8080;

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.use('/setup', setupRoutes)
app.use(authMiddleware)
app.use('/artists', artistRoutes)
app.use('/concepts', conceptRoutes)

app.get('/', (req, res) => {
  // check for first installation
  setup.setupRequired()
  .then((bool: boolean) => {
    if (bool) {
      res.render('setup', {})
    } else {
      res.render('index', {})
    }
  })
});

app.listen(port, () => {
  console.log( `server started at ${port}`);
});