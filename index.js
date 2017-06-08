'use strict';
const Nightmare = require('nightmare');

/*
tests to run:
* we'll track the pageviews/events that are recorded by the page. let's come up with an interface for how to do this. i'm thinking that we should use a jquery event to pass data to the testing framework. i'm thinking we'd pass two pieces of data -- the event "type", and then an object with various parameters.
X* track the total elapsed time of the test (we'll have to figure out when it is okay to advance)
* track the slideshow images that loaded
* track the caption / subcaption text that loaded
* capture page events

finally:
* output success or failure
*/

class NightmareQA {
  constructor({
    host = 'http://stars.topix.com',
    layoutMode = 'prod-active',
    itemId = 18627,
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
    this.startTime = process.hrtime();
    this.nightmare = Nightmare({
      show: this.dev,
      openDevTools: this.dev
    });
    this.result = {};

    this.main().then(result => {
      console.log(result);
    });
  }

  async main() {
    try {
      await this.nightmare
        .viewport(this.windowWidth, this.windowHeight)
        .goto(`${this.host}/quiz/${this.itemId}/?layoutmode=${this.layoutMode}`);

      const emptyList = Array.apply(null, Array(this.slides));
      const urls = emptyList.map((val, index) => {
        return `${this.host}/quiz/${this.itemId}/qidx${index + 1}/?layoutmode=${this.layoutMode}`;
      });

      const promises = urls.map((url) => this.quizAction(url));

      await Promise.all(promises);
      await this.nightmare.end();

      this.result.status = true;
    }
    catch (error) {
      this.result.status = false;
      console.error(error);
    }
    finally {
      this.result.elapsedTime = process.hrtime(this.startTime)[0];
      return this.result;
    }
  }

  async quizAction(url) {
    const selector = '#questionText';

    await this.nightmare
      .goto(url)
      // .wait(selector)
      .evaluate(function (selector) {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(document.querySelector(selector).innerText), 2000);
      })}, selector)
      .then(function(text) {
        console.log(text);
      });

    await this.nightmare
      .click('.quiz_answer-item-anim')
      // .wait(this.waitBetweenSlides)
      .click('.ico-circled-right-arrow-filled')
      // .wait(this.waitBetweenSlides);
  }
}

module.exports = NightmareQA;
