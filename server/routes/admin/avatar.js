module.exports = (app, plugin, model) => {
  const express = require('express')
  const router = express.Router()

  let { Avatar } = model
  let { GetPage, RequestResult } = plugin

  router.get('/avatar', async (req, res) => {
    let screen = req.query.classify_id ? { classify_id: req.query.classify_id } : null
    const data = await GetPage(Avatar, req.query.page, req.query.count,screen)
    res.send(RequestResult(null, data))
  })

  router.post('/avatar', (req, res) => {
    Avatar.create(req.body.data, (err, doc) => {
      res.send(RequestResult(err, doc))
    })
  })

  router.post('/avatar/:_id', (req, res) => {
    Avatar.findByIdAndUpdate(req.params._id, req.body.data, (err, doc) => {
      res.send(RequestResult(err, doc))
    })
  })

  router.get('/avatar/:_id', (req, res) => {
    Avatar.findById(req.params._id, (err, doc) => {
      res.send(RequestResult(err, doc))
    })
  })

  router.delete('/avatar/:_id', (req, res) => {
    Avatar.findByIdAndDelete(req.params._id, (err, doc) => {
      res.send(RequestResult(err, doc))
    })
  })

  app.use('/admin/api', router)
}
