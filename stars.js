const Nightmare = require('nightmare');
const vo = require('vo');
const nightmare = Nightmare({
  show: true
});
const path = require('path');
const config = require(path.join(__dirname, 'config.js'));

vo(run)(function(err, result) {
  if (err) throw err;
});

function* run() {
  yield nightmare
    .viewport(config.windowWidth, config.windowHeight)
    .goto(`${config.host}/slideshow/${config.itemid}/?layoutmode=${config.layoutMode}`);

  for (let i = 0; i < config.slides; i++) {
    var results = yield * loopThroughSlides(i);
  }

  yield nightmare.end();
}

function* loopThroughSlides(i) {
  if (i === 0) {
    var value = yield nightmare
      .wait('.x-text')
      .click('.x-text')
      .wait(config.waitBetweenSlides)
      .evaluate(function() {
        return document.title;
      });

    console.log(value);
    if (config.screenshots) {
      let path = `screenshots/${config.itemid}-${i}.png`;
      yield nightmare.screenshot(path);
    }
  } else {
    var value = yield nightmare
      .click('.js-next')
      .wait(config.waitBetweenSlides)
      .evaluate(function() {
        return document.title;
      });

    console.log(value);
    if (config.screenshots) {
      let path = `screenshots/${config.itemid}-${i}.png`;
      yield nightmare.screenshot(path);
    }
  }
}
