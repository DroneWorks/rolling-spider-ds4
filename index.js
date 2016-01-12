'use strict';

const dualShock     = require('dualshock-controller'),
      RollingSpider = require("rolling-spider");

const scale = (input, sign=1) => input <= 5 ? 0 : sign * Math.round(input / 255 * 200 - 100);

let controller = dualShock({
    config: "dualshock4-generic-driver",
    accelerometerSmoothing : true,
    analogStickSmoothing : false
});

let rollingSpider = new RollingSpider();

let commands = {
    forward: 0,
    tilt: 0,
    turn: 0,
    up: 0
};

rollingSpider.connect(() => {
    rollingSpider.setup(() => {
        rollingSpider.wheelOff();
        rollingSpider.flatTrim();

        console.log('ready!');
        rollingSpider.startPing();

        controller.on('left:move', ({ x, y }) => {
            commands.turn = scale(x);
            commands.up = scale(y, -1);
        });
        controller.on('right:move', ({ x, y }) => {
            commands.tilt = scale(x);
            commands.forward = scale(y, -1);
        });

        //controller.on('square:press', console.log);
        controller.on('x:press', () => {
            rollingSpider.toggle();
        });
        //controller.on('circle:press', console.log);
        controller.on('triangle:press', () => {
            rollingSpider.emergency();
        });

        setInterval(() => {
            rollingSpider.drive(commands, -1);
        }, 100);
        console.log('driving...');
    });
});
