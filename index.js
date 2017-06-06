'use strict';
const Nightmare = require('nightmare');

class NightmareQA {
  constructor({
    host = 'http://stars.topix.com',
    layoutMode = 'prod-active',
    itemId = 16088,
    screenshots = false,
    slides = 10,
    windowWidth = 1366,
    windowHeight = 768,
    waitBetweenSlides = 2500,
    dev = true
  }) {
    this.host = host;
    this.layoutMode = layoutMode;
    this.itemId = itemId;
    this.screenshots = screenshots;
    this.slides = slides;
    this.windowWidth = windowWidth;
    this.windowHeight = windowHeight;
    this.waitBetweenSlides = waitBetweenSlides;
    this.dev = dev;
    this.nightmare = Nightmare({
      show: this.dev,
      openDevTools: this.dev
    });

    this.main().then(result => {
      console.log(result);
    });
  }

  async main() {
    try {
      await this.nightmare
        .goto('https://duckduckgo.com')
        .wait(5000)
        
      await this.nightmare.end();

      return {
        result: 'some result'
      };
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = NightmareQA;
