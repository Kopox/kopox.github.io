function attributeButtons() {
    textArea = select("#textArea");
    selectText();
    
    submit = select("#submit");
    submit.mousePressed(newText);
    
    reset = select("#reset");
    reset.mousePressed(removeTexts);
    
    randomText = select("#randomText");
    randomText.mousePressed(newSelectText);
}

function removeTexts() {
    if (key = " ") {
        for (var i = 0; i < txtList.length; i++) {
            txtList[i].remove();
        }
        txtList = [];
    }
}

function newSelectText() {
    var currentText = txt;
    
    for (var i = 0; i < 1000; i++) {
        if (currentText == txt) {
            selectText();
        } else {
            break;
        }
    }
}