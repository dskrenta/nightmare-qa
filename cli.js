'use strict';
const vorpal = require('vorpal')();
const fs = require('fs');

let config = {
  host: 'http://stars.topix.com',
  layoutMode: 'prod-active',
  itemId: 16088,
  screenshots: false,
  slides: 90,
  windowWidth: 1366,
  windowHeight: 768,
  waitBetweenSlides: 2500,
  dev: false
};

vorpal
  .command('test', 'Test a slideshow')
  .option('-s --slideshow', 'Slideshow test')
  .option('-q --quiz', 'Quiz test')
  .option('--screenshots', 'Screenshots mode')
  .option('--dev', 'Development mode')
  .action(function (args, cb) {
    this.prompt({
      type: 'input',
      name: 'host',
      message: 'host: '
    }).then((result) => {
      this.log(result);
      return this.prompt({
        type: 'input',
        name: 'layoutMode',
        message: 'layoutMode: '
      });
    }).then((result) => {
      this.log(result);
      return this.prompt({
        type: 'input',
        name: 'itemId',
        message: 'itemId: '
      });
    }).then((result) => {
      this.log(result);
      return this.prompt({
        type: 'input',
        name: 'slides',
        message: 'Number of slides to visit: '
      });
    }).then((result) => {
      this.log(result);
    })
    cb();
  });

vorpal
  .delimiter('nightmarejs-qa$')
  .show();
