 var canvas;
    var tooltip;
    var contextMenu;
    var mousePos = {
        x: 0,
        y: 0
    }
    var color_encoding = {
        '[255, 0, 0]': 'Degraded Gallery Forest',
        '[60, 154, 206]': 'Wetland',
        '[50, 50, 50]': 'Landfill',
        '[0, 255, 0]': 'Plantation',
        '[98, 124, 61]': 'Mangrove',
        '[217, 212, 12]': 'Agric',
        '[0, 1, 128]': 'Waterbody',
        '[255, 223, 167]': 'Sandy Area',
        '[180, 96, 0]': 'Rocky Land',
        '[142, 125, 115]': 'Bare Soil',
        '[251, 72, 196]': 'Settlement',
        '[179, 227, 214]': 'Irrigated Agric',
        '[255, 128, 64]': 'Gallery',
        '[41, 49, 28]': 'Shrub and Tee Savanna',
        '[231, 177, 106]': 'Wooded Savanna',
        '[65, 100, 34]': 'Forest',
        '[50, 50, 50]': 'Salt Pan',
        '[119, 85, 60]': 'Degraded',
        '[128, 64, 255]': 'Bowe',
        '[90, 64, 128]': 'Agriculture in Shallow and Recession',
        '[255, 64, 64]': 'Woodland',
        '[0, 255, 255]': 'Dam',
        '[128, 0, 64]': 'Herbaecous Savanna',
        '[255, 255, 255]': 'Shrub Land',
        '[0, 0, 0]': 'No Data'
    }

    
    jQuery(document).ready(function ($) {
        var label = document.getElementById('label');
        canvas = document.getElementById('myCanvas');
        tooltip = document.getElementById('tooltip');
        contextMenu = document.getElementById('context-menu');
        var map_im = document.getElementById('map_im');
        var context = canvas.getContext('2d');
        var img = new Image();
        img.onload = function () {
            // canvas.style.height = img.height + 'px';
            // canvas.style.width = img.width + 'px';
            context.canvas.height = img.height;
            context.canvas.width = img.width;
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            // If it's resolution does not match change it
            // if (canvas.width !== width || canvas.height !== height) {
            //     canvas.width = width;
            //     canvas.height = height;
            //     return true;
            // }
            context.drawImage(img, 0, 0, img.width, img.height);
            label.innerText = '(' + width + ", " + height + ')';
        }
        // contextMenu.click = function () {
        //     contextMenu.style.display = 'none';
        // }
        img.src = 'html/land_use_land_cover_map.png';
        var legend_ul = document.getElementById('legend-list');
        for (encoding in color_encoding) {
            legend_ul.appendChild(createLegend(encoding));
        }

    });

    function createLegend(class_info) {
        var li = document.createElement("li");
        li.classList.add('class-info')
        var input = document.createElement("input");
        input.type = 'checkbox';
        var classNameSpan = document.createElement("span");
        classNameSpan.classList.add('class-name');
        classNameSpan.innerText = color_encoding[class_info];
        var legendColorSpan = document.createElement("span");
        legendColorSpan.classList.add('legend-color')
        vals = class_info.replace('[', '').replace(']', '').replace(/ /g, '').split(',');
        var r = Number(vals[0])
        var g = Number(vals[1])
        var b = Number(vals[2]);
        li.appendChild(input);
        li.appendChild(classNameSpan);
        li.appendChild(legendColorSpan);
        legendColorSpan.style.backgroundColor = "rgb" + class_info.replace('[', '(').replace(']',
            ')'); //"rgb(155, 102, 102)";
        // legendColorSpan.style.backgroundColor = '#' + rgbToHex(r, g, b);
        // li.innerText = "Waterbody"
        return li;
    }

    function findPos(obj) {
        var current_left = 0,
            current_top = 0;
        if (obj.offsetParent) {
            do {
                current_left += obj.offsetLeft;
                current_top += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return {
                x: current_left,
                y: current_top
            };
        }
        return undefined;
    }

    function rgbToHex(r, g, b) {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }

    // $('#myCanvas').mouseenter(function () {
    // tooltip.style.display = "block"
    // });

    $('#myCanvas').mousemove(function (e) {
        var label = document.getElementById('label');
        // var tooltip = document.getElementById('tooltip');
        var position = findPos(this);
        var x = e.pageX - position.x;
        var y = e.pageY - position.y;
        const bb = this.getBoundingClientRect();
        const c_x = Math.floor((event.clientX - bb.left) / bb.width * canvas.width);
        const c_y = Math.floor((event.clientY - bb.top) / bb.height * canvas.height);
        // var coordinate = "x=" + x + ", y=" + y;
        var context = this.getContext('2d');

        var p = context.getImageData(c_x, c_y, 1, 1).data;
        label.innerText = '(' + c_x + ", " + c_y + ')';
        // label.innerText = '[' + p[0] + ", " + p[1] + ", " + p[2] + ']';
        // var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
        var rgb = '[' + p[0] + ", " + p[1] + ", " + p[2] + ']';
        // label.innerText = rgb;
        // canvas.title = rgb
        tooltip.innerText = color_encoding[rgb]
        // tooltip.style.display = "block"
        tooltip.style.left = (x + 10) + "px";
        tooltip.style.top = (y + 10) + "px";
    });

    $('#context-menu').click(function (e) {
        contextMenu.style.display = 'none';
    })

    $('#myCanvas').click(function (e) {

        var position = findPos(this);
        var x = e.pageX - position.x;
        var y = e.pageY - position.y;
        mousePos.x = x;
        mousePos.y = y;
        tooltip.style.display = 'block';
        contextMenu.style.display = 'none';
    });

    $('#myCanvas').contextmenu(function (e) {
        var selectClassEl = document.getElementById('select-class');
        var position = findPos(this);
        var x = e.pageX - position.x;
        var y = e.pageY - position.y;
        const bb = this.getBoundingClientRect();
        const c_x = Math.floor((event.clientX - bb.left) / bb.width * canvas.width);
        const c_y = Math.floor((event.clientY - bb.top) / bb.height * canvas.height);
        mousePos.x = c_x;
        mousePos.y = c_y;
        // var contextMenu = document.getElementById('context-menu');
        contextMenu.style.display = 'block';
        contextMenu.style.left = (x) + "px";
        contextMenu.style.top = (y) + "px";
        selectClassEl.innerText = `Show ${tooltip.innerText} class only`
        tooltip.style.display = 'none';
    })

    $('#select-class').click(function () {
        var label = document.getElementById('label');
        label.innerText = mousePos.x;
        var context = canvas.getContext('2d');
        var p = context.getImageData(mousePos.x, mousePos.y, 1, 1).data;
        showSelectedClass(p[0], p[1], p[2]);
        // var pRgb = rgbToText(p[0], p[1], p[2]);
        // const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        // const data = imgData.data;
        // const newData = [];
        // var bRgb = rgbToText(0, 0, 0);
        // // enumerate all pixels
        // // each pixel's r,g,b,a datum are stored in separate sequential array elements
        // for (let i = 0; i < data.length; i += 4) {
        //     const red = data[i];
        //     const green = data[i + 1];
        //     const blue = data[i + 2];
        //     rgb = rgbToText(red, green, blue);
        //     if (!(rgb === pRgb || rgb === bRgb)) {
        //         data[i] = 70;
        //         data[i + 1] = 70;
        //         data[i + 2] = 70;
        //     }
        //     // const alpha = data[i + 3];
        // }
        // context.putImageData(imgData, 0, 0);
    })

    function showSelectedClass(r, g, b) {
        var pRgb = rgbToText(r, g, b);
        var context = canvas.getContext('2d');
        const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
        const data = imgData.data;
        const newData = [];
        var bRgb = rgbToText(0, 0, 0);
        // enumerate all pixels
        // each pixel's r,g,b,a datum are stored in separate sequential array elements
        for (let i = 0; i < data.length; i += 4) {
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];
            rgb = rgbToText(red, green, blue);
            if (!(rgb === pRgb || rgb === bRgb)) {
                data[i] = 70;
                data[i + 1] = 70;
                data[i + 2] = 70;
            } 
        }
        context.putImageData(imgData, 0, 0);
    }

    function rgbToText(r, g, b) {
        return `${r} ${g} ${b}`;
    }

    // $('#myCanvas').mouseleave(function () {
    //     tooltip.style.display = "none"
    // });