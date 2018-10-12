window.addEventListener("resize", function(){
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.onload = function() {
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  video.width = window.innerWidth;
  video.height = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var context = canvas.getContext('2d');

  /* 
  Pour ajouter manuellement de nouvelle couleur, il faut utiliser la fonction juste en dessous, en lui indiquant le rgb de la couleur
  C'est assez approximatif, comme tu peux le voir dans le if, pour le black il faut que le tracking détecte que les couleurs à l'écran soit inférieur à 50 pour le r, g et b.
  Faudrait faire une petite fonction qui récupère toutes les couleurs existante, bien prise de tête ça ^^
  Il faudrait créer un tableau comme ceci : 
  ["nomcouleur" => "rgb","nomcouleur2" => "rgb2", etc]
  */
  tracking.ColorTracker.registerColor('#000000', function(r, g, b) {
    if (r < 50 && g < 50 && b < 50) {
      return true;
    }
    return false;
  });
  tracking.ColorTracker.registerColor('#ffffff', function(r, g, b) {
    if (r > 200 && g > 200 && b > 200) {
      return true;
    }
    return false;
  });

  addingColors(tata);


  /*
  Une fois les nouvelles couleurs enregistrer, on peux les initialiser dans notre nouveau tracker
  c'est un tableau de couleur.
  */
  /*  var tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow', 'black','white']);
  */  
  var tracker = new tracking.ColorTracker(watchedColors);
  
  tracking.track('#video', tracker, { camera: true });
  tracking.ColorTracker.prototype.minDimension = 1;
  tracking.ColorTracker.prototype.minGroupSize = 1;
  tracker.on('track', function(event) {
    const tab = new Array();
    const element = document.getElementById('chameleon');
    context.clearRect(0, 0, canvas.width, canvas.height);
    event.data.forEach(function(rect) {
      if (rect.color === 'custom') {
        rect.color = tracker.customColor;
      }
      context.strokeStyle = rect.color;
      context.strokeRect(rect.x, rect.y, rect.width, rect.height);
      context.font = '11px Helvetica';
      context.fillStyle = "#fff";
      context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
      context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
      // Ajout de la couleur sur l'élément afficher à l'écran, il va falloir faire ne sorte de bien récupérer la moyenne de toutes les couleurs pour lui ajout en background ou autre
      tab.push(rect.color);
      element.style.background = rect.color;
    });
  });
};




function mixColor(tab) {
  let colorTotalTab = [];
  console.log(colorTotalTab);
  for (let i = tab.length - 1; i >= 0; i--) {
    colorTotalTab.push(createCustomColorMix(tab[i])); 
  };
  console.log(colorTotalTab);
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
  console.log(totalColorR);
  console.log(totalColorG);
  console.log(totalColorB);

  finalColorR = totalColorR / tab.length;
  finalColorG = totalColorG / tab.length;
  finalColorB = totalColorB / tab.length;
  console.log(finalColorR);
  console.log(finalColorG);
  console.log(finalColorB);

  colorsMixed.push(finalColorR , finalColorG , finalColorB);
  console.log(colorsMixed);
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
      if ((r < customColorR - 30 && r > customColorR + 30)  && (g < customColorG - 30 && r > customColorG + 30) && (b < customColorB - 30 && r > customColorB + 30)) {
        return true;
      }
      return false;
    });
    //add the hexadecimal(name) to the watched colors
    watchedColors.push(tab[i]);
  }
  return watchedColors;
}


let tata = ['#663300' , '#663300' , '#cc3300' , '#993300' , '#990000' , '#800000' , '#993333'];
console.log(tata);

/*mixColor(tata);  
*/