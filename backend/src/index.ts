import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { generateOdai } from './functions/generateOdai';
export { scoreBoke } from './functions/scoreBoke';
export { analyzeAndUpdateBrain } from './functions/analyzeAndUpdateBrain';
export { runBattle } from './functions/runBattle';
