"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateHalfYearlyAccrual = exports.calculateYearlyAccrual = exports.calculateQuaterlyAccrual = exports.calculateMonthlyAccrual = void 0;
const calculateMonthlyAccrual = (annualEligibility) => {
    const monthlyAccrual = annualEligibility / 12;
    return monthlyAccrual;
};
exports.calculateMonthlyAccrual = calculateMonthlyAccrual;
const calculateQuaterlyAccrual = (annualEligibility) => {
    const quaterlyAccrual = annualEligibility / 4;
    return quaterlyAccrual;
};
exports.calculateQuaterlyAccrual = calculateQuaterlyAccrual;
const calculateYearlyAccrual = (annualEligiibility) => {
    const yearlyAccrual = annualEligiibility;
    return yearlyAccrual;
};
exports.calculateYearlyAccrual = calculateYearlyAccrual;
const calculateHalfYearlyAccrual = (annualEligibility) => {
    const halfYearlyAccrual = annualEligibility / 2;
    return halfYearlyAccrual;
};
exports.calculateHalfYearlyAccrual = calculateHalfYearlyAccrual;
