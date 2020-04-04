const sinon = require('sinon')

function stubRes () {
  let doneResolve
  let doneReject

  // res is a promise so we can call .then to do things when the res is completed
  const res = new Promise(function (resolve, reject) {
    doneResolve = this.resolve = resolve
    doneReject = this.reject = reject
  })

  res.status = sinon.spy(statusCode => {
    res.statusCode = statusCode
    return res
  })

  res.send = sinon.spy(text => {
    if (!res.statusCode) res.statusCode = 200
    res.text = text
    doneResolve()
  })

  res.json = sinon.spy(json => {
    if (!res.statusCode) res.statusCode = 200
    res.text = JSON.stringify(json)
    doneResolve()
  })

  res.sendStatus = sinon.spy(statusCode => {
    if (!res.statusCode) res.statusCode = statusCode
    doneResolve()
  })

  res.error = sinon.spy(error => {
    doneReject(error)
  })

  res.redirect = sinon.spy(() => doneResolve())
  return res
}

function createDeferredNext () {
  let resolve
  const promise = new Promise(function () {
    resolve = arguments[0]
  })
  const fn = (arg) => resolve(arg)
  fn.then = promise.then.bind(promise)
  return fn
}

module.exports = {
  stubRes,
  createDeferredNext
}
