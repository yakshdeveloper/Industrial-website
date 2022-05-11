$(document).ready(function(){



var a = 0;
$(window).scroll(function() {

  var oTop = $('.experince, .team ').offset().top - window.innerHeight;
  if (a == 0 && $(window).scrollTop() > oTop) {
    $('.counter-value').each(function() {
      var $this = $(this),
        countTo = $this.attr('data-count');
      $({
        countNum: $this.text()
      }).animate({
          countNum: countTo
        },

        {

          duration: 2000,
          easing: 'swing',
          step: function() {
            $this.text(Math.floor(this.countNum));
          },
          complete: function() {
            $this.text(this.countNum);
            //alert('finished');
          }

        });
    });
    a = 1;
  }

});

var Animation = function(animationBar, percentage) {

  this.animationBar = animationBar;
  this.percentage = percentage;
  this.animationArray = null;
  this.animationOffset = null;
  this.labelArray = null;
  this.percentageArray = null;
  this.index = 0;

  this.initialize();

};  

Animation.prototype.initialize = function() {

  this.animationArray = document.getElementsByClassName(this.percentage);

  if (this.animationOffset === null)
    this.animationOffset = [];

  if (this.labelArray === null)
    this.labelArray = [];

  if (this.percentageArray === null)
    this.percentageArray = [];

  this.setUpElements();

};

Animation.prototype.setUpElements = function() {

  for (var i = 0; i < this.animationArray.length; i++) {
    var elem = this.animationArray[i],
      offset = elem.offsetTop + document.getElementsByClassName(this.percentage)[0].clientHeight,
      percentage = $(this.animationArray[i]).data(this.percentage);

    this.animationOffset.push(offset);
    this.percentageArray.push(percentage);

    $(this.animationArray[i]).find('.label').html( percentage + '%');
  }

  this.attachListeners();
}

Animation.prototype.attachListeners = function() {

  $(window).on('scroll', this.onWindowScroll.bind(this));
};

Animation.prototype.onWindowScroll = function() {

  for (var i = 0; i < this.animationArray.length; i++) {
    if (window.pageYOffset >= this.animationOffset[this.index] - window.innerHeight) {
      this.showElement();
      this.index++;
    } else
      return;
  }
};

Animation.prototype.showElement = function() {
  var element = document.getElementsByClassName(this.percentage)[this.index];
  element.className += ' show';
  this.animateBar(element, this.percentageArray[this.index]);
}

Animation.prototype.animateBar = function(element, width) {

  var $element = $(element),
    className = ' p' + width;

  $element.find(this.animationBar).addClass(className);
}

new Animation('.animation-bar', 'percentage');

});