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
        newWidth = parseFloat(newWidth);
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

let printWheels = function(wheelSetups) {

    let html = '<br><br>RELIPPED:<br>';

    for (const setup of wheelSetups) {

        if (setup.highlight) {
            html += `<br>Front: ${setup.front} Rear: ${setup.rear}`;
        }
        else {
            html += `<span style="color: #ccc"><br>Front: ${setup.front} Rear: ${setup.rear}</span>`;
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
    printWheels([
        { front: frontWheel.relip(frontWidth-0.5), rear: rearWheel.relip(rearWidth-0.5) },
        { front: frontWheel.relip(frontWidth),     rear: rearWheel.relip(rearWidth), highlight: true },
        { front: frontWheel.relip(frontWidth+0.5), rear: rearWheel.relip(rearWidth+0.5) },
    ]);
});
