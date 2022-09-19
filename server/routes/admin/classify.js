module.exports = (app, plugin, model) => {
  const express = require('express');
  const router = express.Router();
  
  let { Classify } = model
  let { GetPage, RequestResult } = plugin

  router.get('/classify', async (req, res) => {
      const data = await GetPage(Classify, req.query.page)
      res.send(RequestResult(null, data))
  })

  router.post('/classify', (req, res) => {
    Classify.create(req.body.data, (err, doc) => {
          res.send(RequestResult(err, doc))
      })
  })

  router.post('/classify/:_id', (req, res) => {
    Classify.findByIdAndUpdate(
          req.params._id, 
          req.body.data, 
          (err, doc) => {
              res.send(RequestResult(err, doc))
          })
  })

  router.get('/classify/:_id', (req, res) => {
    Classify.findById(
          req.params._id, 
          (err, doc) => {
              res.send(RequestResult(err, doc))
          })
  })

  router.delete('/classify/:_id', (req, res) => {
    Classify.findByIdAndDelete(
          req.params._id,
          (err, doc) => {
              res.send(RequestResult(err, doc))
          })
  })

  app.use('/admin/api', router)
}