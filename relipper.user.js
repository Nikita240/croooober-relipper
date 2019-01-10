// ==UserScript==
// @name       "relipper"
// @namespace  Relip
// @version    0.1
// @description  HI Adel
// @match      http://www.croooober.com/*
// @grant      none
// @run-at     document-start
// ==/UserScript==

var relip = function(givenWidth, givenOffset, newWidth) {
    return Math.round(givenOffset-(newWidth-givenWidth)/2*25.4);
}

var column = $('th:contains("Rim Size")').next();
var regex = /Front:([\d\.]+)Jx(\d+)([-+]\d+)\s*Rear:([\d\.]+)Jx(\d+)([-+]\d+)/;

var results = regex.exec(column.text());

if (!results) {
    var singleRegex = /([\d\.]+)Jx(\d+)([-+]\d+)/
    results = singleRegex.exec(column.text());
}

console.log(results);

var frontWheel = {
    width: results[1],
    height: results[2],
    offset: parseInt(results[3])
}
var rearWheel = {
    width: results[4],
    height: results[5],
    offset: parseInt(results[6])
}

if (!rearWheel.width) {
    rearWheel = frontWheel;
}

console.log(frontWheel);
console.log(rearWheel);

var addWidths = function(targets, target=false) {

    let html = '<br><br>RELIPPED:<br>';

    for (const target of targets) {
        let newFrontWheel = {
            width: target.front,
            height: frontWheel.height,
            offset: relip(frontWheel.width, frontWheel.offset, target.front)
        }
        let newRearWheel = {
            width: target.rear,
            height: rearWheel.height,
            offset: relip(rearWheel.width, rearWheel.offset, target.rear)
        }

        if (target.highlight) {
            html +=
                '<b><br>Front: '
                + newFrontWheel.height+'x'+newFrontWheel.width.toFixed(1)+(newFrontWheel.offset>=0 ? '+' : '')+newFrontWheel.offset
                + ' Rear: '
                + newRearWheel.height+'x'+newRearWheel.width.toFixed(1)+(newRearWheel.offset>=0 ? '+' : '')+newRearWheel.offset
                + '</b>';
        }
        else {
            html +=
                '<span style="color: #ccc"><br>Front: '
                + newFrontWheel.height+'x'+newFrontWheel.width.toFixed(1)+(newFrontWheel.offset>=0 ? '+' : '')+newFrontWheel.offset
                + ' Rear: '
                + newRearWheel.height+'x'+newRearWheel.width.toFixed(1)+(newRearWheel.offset>=0 ? '+' : '')+newRearWheel.offset
                + '</span>';
        }
    }


    column.html(column.html() + html);
}

chrome.storage.sync.get({
    frontWidth: 9,
    rearWidth: 11,
}, function(options) {
    const frontWidth = parseFloat(options.frontWidth);
    const rearWidth  = parseFloat(options.rearWidth);
    addWidths([
        { front: frontWidth-0.5, rear: rearWidth-0.5 },
        { front: frontWidth, rear: rearWidth, highlight: true },
        { front: frontWidth+0.5, rear: rearWidth+0.5 },
    ]);
});
// addWidths(8.5, 10.5);
// addWidths(9, 11);
// addWidths(9.5, 11.5);
// addWidths(10, 12);
