'use strict';

const path = require('path');
const config = require(path.join(__dirname, 'config.js'));
const Nightmare = require('nightmare');
const vo = require('vo');
const nightmare = Nightmare({
  show: true,
  openDevTools: config.dev
});

let numImages = 0;

vo(run)(function(err, result) {
  if (err) throw err;
});

function *run () {
  yield nightmare
    .viewport(config.windowWidth, config.windowHeight)
    .goto(`${config.host}/slideshow/${config.itemid}/?layoutmode=${config.layoutMode}`);

  for (let i = 0; i < config.slides; i++) {
    if (i === 0) {
      numImages = yield *loopThroughSlides(i);
    } else {
      yield *loopThroughSlides(i);
    }
  }

  for (let i = 1; i < numImages; i++) {
    let cookie = yield getCookie(`slideshowimage${i}`);
    console.log(cookie);
  }

  yield nightmare.end();
}

function *getCookie (name) {
  let cookie = yield nightmare
    .cookies.get({ url: null, name: name })
    .then((cookie) => {
      return cookie;
    });
  return cookie;
}

function *loopThroughSlides (i) {
  if (i === 0) {
    let result = yield nightmare
      .wait('.x-text')
      .click('.x-text')
      .wait(config.waitBetweenSlides)
      .evaluate(() => {
        let topCaptionsList = document.querySelectorAll('.js-slide-caption');
        let imagesList = document.querySelectorAll('.js-slide-img');
        let slideCaptionsList = document.querySelectorAll('.x-slide-subcaption');

        let topCaptions = Array.from(topCaptionsList);
        let images = Array.from(imagesList);
        let slideCaptions = Array.from(slideCaptionsList);

        topCaptions.forEach((item, index) => {
          topCaptions[index] = item.textContent.trim();
        });

        images.forEach((item, index) => {
          if (item.src !== 'http://static.topixcdn.com/px/images/blank.png') {
            item.onerror = () => {
              document.cookie = `slideshowimage${index}=error`;
            }
            item.onload = () => {
              document.cookie = `slideshowimage${index}=load`;
            }
          }
        });

        slideCaptions.forEach((item, index) => {
          slideCaptions[index] = item.textContent.trim();
        });

        return {
          topCaptions: topCaptions,
          images: images,
          slideCaptions: slideCaptions
        };
      });

    result.topCaptions.forEach((item, index) => {
      console.log(`${item} \n`);
    });

    result.images.forEach((item, index) => {
      console.log(`${item} \n`);
    });

    result.slideCaptions.forEach((item, index) => {
      console.log(`${item} \n`);
    });

    return result.images.length;

  } else {
    yield nightmare
      .click('.js-next')
      .wait(config.waitBetweenSlides)
      .evaluate(() => {
        let imagesList = document.querySelectorAll('.js-slide-img');
        let images = Array.from(imagesList);
        images.forEach((item, index) => {
          if (item.src !== 'http://static.topixcdn.com/px/images/blank.png') {
            item.onerror = () => {
              document.cookie = `slideshowimage${index}=error`;
            }
            item.onload = () => {
              document.cookie = `slideshowimage${index}=load`;
            }
          }
        });
      });
  }

  if (config.screenshots) {
    let path = `screenshots/${config.itemid}-${i}.png`;
    yield nightmare.screenshot(path);
  }
}
