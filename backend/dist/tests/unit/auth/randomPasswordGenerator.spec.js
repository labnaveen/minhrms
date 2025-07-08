"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const RandomPassword_1 = require("../../../src/services/auth/RandomPassword");
(0, mocha_1.describe)('Generating a random Password', () => {
    (0, mocha_1.it)('should return a string of a random password', async () => {
        const result = (0, RandomPassword_1.generatePassword)();
        (0, chai_1.expect)(result).to.be.a('string');
    });
});
