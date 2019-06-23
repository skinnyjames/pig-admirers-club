import multer from 'multer'
import { Request, Router } from 'express'
import conceptModel from './../models/concept'
import { ValidationError } from '../lib/errors'
import path from 'path'
import move from 'move-file'
import fs from 'fs';
import util from 'util'
import * as bluebird from 'bluebird'

const readdir = util.promisify(fs.readdir)
const unlink = util.promisify(fs.unlink)
const stat = util.promisify(fs.stat)

interface ISessionRequest extends Request {
  session: any
  user: any
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/temp/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })


const router =  Router()
router.post('/upload', upload.single('file'), (req, res) => {
  res.send({
    ...req.file,
    status: 'success'
  })
})

router.delete('/:id', async (req: ISessionRequest, res) => {
  if (!req.user) {
    res.statusCode = 500
    res.send('unauthorized')
  } else {
    try {
      let userId = req.user.id
      let concept: any = await conceptModel.get(req.params.id)
      if ((concept.artist_id != userId) || !!concept.order_id) {
        console.log(concept, req.user)
        res.statusCode = 401
        res.send('unauthorized')
      } else {
        let images = await conceptModel.images(concept.id)
        let imageNames = images.map((image: any) => {
          return image.image_name
        })

        let tempFiles = await readdir('public/gallery')
        tempFiles = await bluebird.Promise.filter(tempFiles, async (filename: string) => {
          try {
            await stat(`public/gallery/${filename}`)
            console.log('IMAGENAMES', imageNames, filename, imageNames.includes(filename))
            return imageNames.includes(filename)
          } catch (err) {
            console.log(err)
            return false
          }
        })
        console.log(tempFiles)
        const unlinks = tempFiles.map((temp) => {
          return unlink(`public/gallery/${temp}`)
        })
        await Promise.all(unlinks)
        await conceptModel.delete(concept.id)
        res.send('deleted')
      }

    } catch (err) {
      console.log(err)
      res.statusCode = 500
      res.send(err)
    }
  }
})

router.get('/fetch', async (req: ISessionRequest, res) => {
  if (!req.user) {
    res.statusCode = 500
    res.send('unauthorized')
  } else {
    try {
      let id = req.user.id
      let concepts = await conceptModel.byUser(id)
      res.send(concepts)
    } catch (err) {
      res.statusCode = 500
      res.send(err)
    }
  }
})

router.post('/new', async (req: ISessionRequest, res) => {
  let conceptData = req.body
  if (!req.user) {
    res.statusCode = 500
    res.send('unauthorized')
  } else {
    try {
      conceptData.artistId = req.user.id
      let id = await conceptModel.create(conceptData)
      let files = conceptData.images.map((image: any) => { return image.response })
      await conceptModel.createImages(id, files)
      // migrate images 
      let moves = files.map((file: any) => {
        let oldPath = `public/temp/${file.filename}`
        let newPath = `public/gallery/${file.filename}`
        return move(oldPath, newPath, {overwrite: false})
      })
      await Promise.all(moves)

      // clear temp
      const tempFiles = await readdir('public/temp')
      const unlinks = tempFiles.map((temp) => {
        return unlink(`public/temp/${temp}`)
      })
      await Promise.all(unlinks)
      res.statusCode = 200
      res.send('Success!')
    } catch (err) {
      if (err instanceof ValidationError) {
        res.statusCode = 401
        res.send(err)
      } else {
        console.log(err)
        res.statusCode = 500
        res.send('Error occurred')
      }
    }
  }
})


export = router