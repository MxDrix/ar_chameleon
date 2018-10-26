window.addEventListener("resize", function(){
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.onload = function() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  let colorSample = ['#003366' , '#00ffff' , '#000066' , '#6699ff' , '#660066' , '#ff66ff' , '#993333' , '#ff6666' , '#663300' , '#ffff66' , '#003300' , '#66ff66' , '#ffffff' , '#000000'];  
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var context = canvas.getContext('2d');
  var tracker = new tracking.ColorTracker(addingColors(colorSample));
  
  tracking.track('#video', tracker, { camera: true });
  tracking.ColorTracker.prototype.minDimension = 10;
  tracking.ColorTracker.prototype.minGroupSize = 10;
  console.log(context);
  tracker.on('track', function(event) {
    const allColors = new Array();
    const element = document.getElementById('chameleon');
    context.clearRect(0, 0, canvas.width, canvas.height);
    event.data.forEach(function(rect) {
      //console.log(rect.color);
      if (rect.color === 'custom') {
        rect.color = tracker.customColor;
      }
      // context.strokeStyle = rect.color;
      // context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      // context.font = '11px Helvetica';
      // context.fillStyle = "#fff";
      // context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
      // context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22); 
      allColors.push(rect.color);
    });
    mixColor(allColors);
  });
};




function mixColor(tab) {
  let colorTotalTab = [];
  for (let i = tab.length - 1; i >= 0; i--) {
    colorTotalTab.push(createCustomColorMix(tab[i])); 
  };

  synthesize(colorTotalTab);
};

function synthesize(tab) {
  let colorsMixed = [];
  var totalColorR = 0;
  var totalColorG = 0;
  var totalColorB = 0;
  for (var i = tab.length - 1; i >= 0; i--) {
    totalColorR = totalColorR + tab[i][0];
    totalColorG = totalColorG + tab[i][1];
    totalColorB = totalColorB + tab[i][2];
  };

  mainColorR = totalColorR / tab.length;
  mainColorG = totalColorG / tab.length;
  mainColorB = totalColorB / tab.length;

  darkColorR = mainColorR - 60;
  darkColorG = mainColorG - 60;
  darkColorB = mainColorB - 60;

  strongDarkColorR = mainColorR - 150;
  strongDarkColorG = mainColorG - 150;
  strongDarkColorB = mainColorB - 150;

  lightColorR = mainColorR + 75;
  lightColorG = mainColorG + 75;
  lightColorB = mainColorB + 75;

  colorsMixed.push(mainColorR , mainColorG , mainColorB);
  
  mainColorFill = 'rgb(' + mainColorR + ',' + mainColorG + ',' + mainColorB + ')';
  darkColorFill = 'rgb(' + darkColorR + ',' + darkColorG + ',' + darkColorB + ')';
  strongDarkColorFill = 'rgb(' + strongDarkColorR + ',' + strongDarkColorG + ',' + strongDarkColorB + ')';
  lightColorFill = 'rgb(' + lightColorR + ',' + lightColorG + ',' + lightColorB + ')';
  colorsApply(mainColorFill,darkColorFill,strongDarkColorFill,lightColorFill);
}

function colorsApply(mainColorFill,darkColorFill,strongDarkColorFill,lightColorFill) {
  var base = document.getElementById('base');
  base.style.fill = mainColorFill;

  var eyeContainer = document.getElementById('eye-container');
  eyeContainer.style.fill = darkColorFill;

  var leg = document.getElementsByClassName('leg');
  for (var i = leg.length - 1; i >= 0; i--) {
    leg[i].style.fill = darkColorFill;
  }

  var dots = document.getElementsByClassName('body-dots');
  for (var i = dots.length - 1; i >= 0; i--) {
    dots[i].style.fill = lightColorFill;
  }

  var iris = document.getElementById('iris');
  iris.style.fill = strongDarkColorFill;
}

function createCustomColorMix(value) {
  var components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
  var customColorR = parseInt(components[1], 16);
  var customColorG = parseInt(components[2], 16);
  var customColorB = parseInt(components[3], 16);

  var colorTotal = [];
  colorTotal.push(customColorR , customColorG , customColorB);

  return colorTotal;

};


//adding colors from a tab of hexa
function addingColors(tab) {
  var watchedColors = []
  for (var i = tab.length - 1; i >= 0; i--) {
    //converting hexadecimal in RGB
    var components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(tab[i]);
    var customColorR = parseInt(components[1], 16);
    var customColorG = parseInt(components[2], 16);
    var customColorB = parseInt(components[3], 16);
    //registering custom colors with a small tolerance
    tracking.ColorTracker.registerColor(tab[i], function(r, g, b) {
      var tolerance = 50;
      if ((r < customColorR + tolerance) 
        && (r > customColorR - tolerance) 
        && (g < customColorG + tolerance) 
        && (g > customColorG - tolerance) 
        && (b < customColorB + tolerance)
        && (b > customColorB - tolerance)) {
        return true;
      }
      return false;
    });
    //add the hexadecimal(name) to the watched colors
    watchedColors.push(tab[i]);
  }
  return watchedColors;
}
