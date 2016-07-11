'use strict';

const Nightmare = require('nightmare');
const vo = require('vo');
const nightmare = Nightmare({
  show: true,
  openDevTools: true
});
const path = require('path');
const config = require(path.join(__dirname, 'config.js'));

vo(run)(function(err, result) {
  if (err) throw err;
});

function *run () {
  yield nightmare
    .viewport(config.windowWidth, config.windowHeight)
    .goto(`${config.host}/slideshow/${config.itemid}/?layoutmode=${config.layoutMode}`);

  for (let i = 0; i < config.slides; i++) {
    var result = yield *loopThroughSlides(i);
  }

  yield nightmare.end();
}

function *loopThroughSlides (i) {
  if (i === 0) {
    let result = yield nightmare
      .wait('.x-text')
      .click('.x-text')
      .wait(config.waitBetweenSlides)
      .evaluate(() => {
        // instead of grabbing img src's register onload events for every image which store data in a cookie

        let topCaptionsList = document.querySelectorAll('.js-slide-caption');
        let imagesList = document.querySelectorAll('.js-slide-img');
        let slideCaptionsList = document.querySelectorAll('.x-slide-subcaption');

        let topCaptions = Array.from(topCaptionsList);
        let images = Array.from(imagesList);
        let slideCaptions = Array.from(slideCaptionsList);

        topCaptions.forEach((item, index) => {
          topCaptions[index] = item.textContent;
        });

        images.forEach((item, index) => {
          images[index] = item.src;
        });

        slideCaptions.forEach((item, index) => {
          slideCaptions[index] = item.textContent;
        });

        return {
          topCaptions: topCaptions,
          images: images,
          slideCaptions: slideCaptions
        };
      });

    result.topCaptions.forEach((item) => {
      console.log(item);
    });

    result.images.forEach((item) => {
      console.log(item);
    });

    result.slideCaptions.forEach((item) => {
      console.log(item);
    });

  } else {
    yield nightmare
      .click('.js-next')
      .wait(config.waitBetweenSlides);
  }

  if (config.screenshots) {
    let path = `screenshots/${config.itemid}-${i}.png`;
    yield nightmare.screenshot(path);
  }
}
