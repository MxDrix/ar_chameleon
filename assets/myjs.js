window.addEventListener("resize", function(){
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
window.onload = function() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  let colorSample =["#000000","#ffffff","#ff0000","#ffff00","#0000ff","#00ff00",'#003366' , '#00ffff' , '#000066' , '#6699ff' , '#660066' , '#ff66ff' , '#993333' , '#ff6666' , '#663300' , '#ffff66' , '#003300' , '#66ff66' ];
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var context = canvas.getContext('2d');

  var tracker = new tracking.ColorTracker(addingColors(colorSample));
  
  tracking.track('#video', tracker, { camera: true });
  tracking.ColorTracker.prototype.minDimension = 1;
  tracking.ColorTracker.prototype.minGroupSize = 1;
  tracker.on('track', function(event) {    
    if (event.data.length === 0) {
    }else{
      const tab = new Array();
      context.clearRect(0, 0, canvas.width, canvas.height);
      event.data.forEach(function(rect) {
        if (rect.color === 'custom') {
        rect.color = tracker.customColor;
        // console.log(tracker)
        }
        // context.strokeStyle = rect.color;
        // context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        // context.font = '11px Helvetica';
        // context.fillStyle = "#fff";
        // context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        // context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        tab.push(rect.color);
        // console.log(rect.color);
      });
      console.log(tab)
      mixColor(tab);
    }
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
  console.log(totalColorR +","+totalColorG+","+totalColorB)
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
  mainColorFill = 'rgb(' + mainColorR + ',' + mainColorG + ',' + mainColorB + ')';
  darkColorFill = 'rgb(' + darkColorR + ',' + darkColorG + ',' + darkColorB + ')';
  strongDarkColorFill = 'rgb(' + strongDarkColorR + ',' + strongDarkColorG + ',' + strongDarkColorB + ')';
  lightColorFill = 'rgb(' + lightColorR + ',' + lightColorG + ',' + lightColorB + ')';
  
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
  let watchedColors = []
  for (let i = tab.length - 1; i >= 0; i--) {
    tab[i] = tab[i].replace('#','');
    let customColorR = parseInt(tab[i].substring(0,2), 16);
    let customColorG = parseInt(tab[i].substring(2,4), 16);
    let customColorB = parseInt(tab[i].substring(4,6), 16);
    //registering custom colors with a small tolerance
    tracking.ColorTracker.registerColor(tab[i], function(r, g, b) {
      var modR,modG,modB;
      if ((r == customColorR)  && (g == customColorG) && (b == customColorB)) {
        return true;
      }
      return false;  
    });
    watchedColors.push(tab[i]);
  }
  return watchedColors;
}
