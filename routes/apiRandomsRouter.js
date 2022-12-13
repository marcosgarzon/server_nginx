const express = require('express');
const router = express.Router();
const {fork} = require('child_process')
const PORT = process.pid

router.get('/', (req, res) => {
    const cantidad = parseInt(req.query.cant)
    let tareaCompletada = fork('./apis/randoms', [cantidad])
    tareaCompletada.on('message', msg => {
      return res.render('random', {message: msg.message, amount: msg.amount, port: PORT})
    })
  })

module.exports = router;