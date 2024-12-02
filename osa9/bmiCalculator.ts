export const calculateBmi = (heightCm: number, weightKg: number) => {
    const height = heightCm / 100;
    const bmi = weightKg / (height ** 2);

    if (bmi < 18.5) {
        return 'Underweight';
    } else if (bmi >= 18.5 && bmi < 25) {
        return 'Normal range';
    } else if (bmi >= 25 && bmi < 30) {
        return 'Overweight';
    } else {
        return 'Obese';
    }
}
if (require.main === module) {
    const bmiArgs = process.argv.slice(2);

    const heightCm = Number(bmiArgs[0]);
    const weightKg = Number(bmiArgs[1]);


    console.log(calculateBmi(heightCm, weightKg));
}

export default calculateBmi;