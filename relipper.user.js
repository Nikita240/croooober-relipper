// ==UserScript==
// @name       "relipper"
// @namespace  Relip
// @version    0.1
// @description  HI Adel
// @match      http://www.croooober.com/*
// @grant      none
// @run-at     document-start
// ==/UserScript==

class Wheel {
    constructor(height, width, offset) {
        this.height = parseInt(height);
        this.width = parseFloat(width);
        this.offset = parseInt(offset);
    }

    relip(newWidth) {
        let newOffset = Math.round(this.offset-(newWidth-this.width)/2*25.4);
        return new Wheel(this.height, newWidth, newOffset);
    }

    toString() {
        return this.height+'x'+this.width.toFixed(1)+(this.offset>=0 ? '+' : '')+this.offset;
    }
}

let relip = function(givenWidth, givenOffset, newWidth) {
    return Math.round(givenOffset-(newWidth-givenWidth)/2*25.4);
}

let column = $('th:contains("Rim Size")').next();
let regex = /Front:([\d\.]+)Jx(\d+)([-+]\d+)\s*Rear:([\d\.]+)Jx(\d+)([-+]\d+)/;

let results = regex.exec(column.text());

if (!results) {
    let singleRegex = /([\d\.]+)Jx(\d+)([-+]\d+)/
    results = singleRegex.exec(column.text());
}

console.log(results);

let frontWheel = new Wheel(results[2], results[1], results[3]);
let rearWheel  = new Wheel(results[5], results[4], results[6]);

if (!rearWheel.width) {
    rearWheel = frontWheel;
}

console.log(frontWheel);
console.log(rearWheel);

let addWidths = function(targets, target=false) {

    let html = '<br><br>RELIPPED:<br>';

    for (const target of targets) {
        let newFrontWheel = frontWheel.relip(target.front);
        let newRearWheel = rearWheel.relip(target.rear);

        if (target.highlight) {
            html +=
                '<b><br>Front: '
                + newFrontWheel
                + ' Rear: '
                + newRearWheel
                + '</b>';
        }
        else {
            html +=
                '<span style="color: #ccc"><br>Front: '
                + newFrontWheel
                + ' Rear: '
                + newRearWheel
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
