'use strict';
const Nightmare = require('nightmare');

/*
tests to run:
* we'll track the pageviews/events that are recorded by the page. let's come up with an interface for how to do this. i'm thinking that we should use a jquery event to pass data to the testing framework. i'm thinking we'd pass two pieces of data -- the event "type", and then an object with various parameters.
X* track the total elapsed time of the test (we'll have to figure out when it is okay to advance)
* track the slideshow images that loaded
* track the caption / subcaption text that loaded

finally:
* output success or failure
*/

// slides
// click x-text to start slideshow
// click js-next to advance
// check x-boxed-title on every slide to verify same slideshow

/*
  QUIZ
  click x-text to start quiz
  foreach quiz question
    click one of quiz_answer-item-anim
    click ico-circled-right-arrow-filled
    click ico-circled-right-arrow-filled
    if x-score exits, exit test
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

    this.main().then(result => {
      console.log(result);
    });
  }

  async main() {
    try {
      await this.nightmare
        .viewport(this.windowWidth, this.windowHeight)
        .goto(`${this.host}/quiz/${this.itemId}/?layoutmode=${this.layoutMode}`)
        .wait('.x-text')
        .click('.x-text')
        .wait(this.waitBetweenSlides);

      for (let i = 0; i < this.slides; i++) {
        console.log(i);
        // http://stars.topix.com/quiz/18627/qidx34
        await this.nightmare
          .click('.quiz_answer-item-anim')
          .wait(2500)
          .click('.ico-circled-right-arrow-filled')
          .wait(2500)
          .click('.ico-circled-right-arrow-filled')
      }

      await this.nightmare.end();

      return {
        elapsedTime: process.hrtime(this.startTime)[0]
      };
    }
    catch (error) {
      console.error(error);
    }
  }

  async quizQuestionAction() {
    try {
      return await this.nightmare
        .click('quiz_answer-item-anim')
        .wait(this.waitBetweenSlides)
        .click('ico-circled-right-arrow-filled')
        .wait(this.waitBetweenSlides)
        .click('ico-circled-right-arrow-filled')
        .wait(this.waitBetweenSlides)
    }
    catch (error) {
      console.error(error);
    }
  }
}

module.exports = NightmareQA;
