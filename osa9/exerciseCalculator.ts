type Results = {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
};

export const calculateExercises = (dailyHours: number[], target: number): Results  => {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(hours => hours > 0).length;
    const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
    const average = totalHours / periodLength;
    const success = average >= target;

    let rating: number;
    let ratingDescription: string;

    if (average >= target) {
        rating = 3;
        ratingDescription = 'Excellent job';
    } else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = 'Not too bad but could be better';
    } else {
        rating = 1;
        ratingDescription = 'Come on, you can do better';
    }

    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average,
    };
}

const args = process.argv.slice(2);

const dailyHours = args[0].split(',').map(Number);
const target = Number(args[1]);

console.log(calculateExercises(dailyHours, target))

