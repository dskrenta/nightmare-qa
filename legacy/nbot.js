const Nightmare = require('nightmare');
const vo = require('vo');
const nightmare = Nightmare({
    title: 'Bot',
    show: true
});
const path = require('path');
const config = require(path.join(__dirname, 'config.js'));

vo(run)(function(err) {
  if (err) throw err
});

function* run() {
  yield nightmare.goto('http://stars.topix.com/slideshow/16438');

  // first slide
  yield nightmare
    .wait('.x-text')
    .click('.x-text')
    .wait(config.waitBetweenSlides);

  var results = yield * loopThroughSlides(gen);
  //console.log(results);
  for (let i = 0; i < results.length; i++) {
    console.log(results[i]);
  }
  yield nightmare.end();
}

function* gen(i) {
  /*
  var value = yield nightmare.wait('input[title="Search"]')
    .click('input[title="Search"]')
    .type('input[title="Search"]', item)
    .click('input[name="btnK"]')
    .wait(100)
    .screenshot(item + '.png')
    .insert('input[title="Search"]', '')
    .evaluate(function() {
      return 'foobar' // STUFF RETURNED HERE
    });
    */

  var value = yield nightmare
      .wait('.js-next')
      .click('.js-next')
      .wait(config.waitBetweenSlides)
      .evaluate(function() {
        //return 'foobar';
        return document.querySelector('.x-slide-subcaption').textContent;
      });

  return value;
  //console.log(`${value} ${i}`);
}

function* forEach(arr, fn) { // NEEDED BECAUSE FOREACH DOESN'T WORK IN GENERATORS
  var results = [];
  for (let i = 0; i < arr.length; i++) {
    results.push(yield * fn(arr[i]));
  }
  return results;
}

function* loopThroughSlides(fn) {
  var results = [];
  for (let i = 1; i <= config.slides - 1; i++) {
    results.push(yield * fn(i));
  }
  return results;
}
