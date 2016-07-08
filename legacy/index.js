var Nightmare = require('nightmare')
var vo = require('vo')
var path = require('path')
var config = require(path.resolve(__dirname, 'config.js'))

vo(run)(function(err, results) {
  if (err) console.log(err)

  results.forEach(function (text) {
    console.log('title: ', text)
  })
})

function *run() {
  var nightmare = Nightmare();
  yield nightmare
    .viewport(config.viewportWidth, config.viewportHeight)
    .goto(`${config.host}/slideshow/${config.itemID}/?layoutmode=${config.layoutMode}`);

  for (var i = i; i <= config.slides; i++) {
    if (i === 1) {
        yield nightmare
          .wait('.x-text')
          .click('.x-text')
          .wait(config.waitBetweenSlides)
    } else {
      yield nightmare
        .click('.js-next')
        .wait(config.waitBetweenSlides)
        .evaluate(function(){
          return document.title
        })
    }
  }

  yield nightmare.end()
}
