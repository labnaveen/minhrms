

export const calculateMonthlyAccrual = (annualEligibility:  number) => {
    const monthlyAccrual = annualEligibility / 12;
    return monthlyAccrual
}


export const calculateQuaterlyAccrual = (annualEligibility: number) => {
    const quaterlyAccrual = annualEligibility / 4;
    return quaterlyAccrual
}

export const calculateYearlyAccrual = (annualEligiibility: number) => {
    const yearlyAccrual = annualEligiibility;
    return yearlyAccrual
}

export const calculateHalfYearlyAccrual = (annualEligibility: number) => {
    const halfYearlyAccrual = annualEligibility / 2;
    return halfYearlyAccrual;
}

