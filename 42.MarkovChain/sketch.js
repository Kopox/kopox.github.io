var txt = "";
var texts = []; // List of the source texts
var txtList = []; // List of the texts generated <p>
var textArea;
var submit;
var reset;
var randomText;

var grams = {};
var order = 5;

//function preload() {
//    txt = loadStrings("genie.txt");
//}

function setup() {
    noCanvas();
    initializeTexts();
    attributeButtons();
}

function draw() {
    
}

function newText() {
    txt = textArea.value();
    createGrams();
    generate();
}

function createGrams() {
    grams = [];
    for (var i = 0; i < txt.length - order; i++) {
        var gram = txt.substring(i, i + order);
        var next = txt.charAt(i + order);
        
        if (!grams[gram]) {
            grams[gram] = [];
        }
        grams[gram].push(next);
    }
}

function generate() {
    var text = txt.substring(0, order);
    var currentGram = "";
    var next = "";
    
    for (var i = 0; i < 2000; i++) {
        currentGram = text.substring(i, i + order);
        if (grams[currentGram]) {
            next = random(grams[currentGram]);
            text += next;
            if( i > 1000 && (next == "." || next == "!" || next == "?")) {
                break;
            }
        } else {
            break;
        }
    }
    
    txtList.push(createP(text));
}