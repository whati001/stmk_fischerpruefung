/**
 * @file index.js
 * @description export all questions as a single object
 * @author andreas.karner@student.tugraz.at
 */

import fishCulture from './qnsFishCulture';
import waterHabitat from './qnsWaterHabitat';
import tradition  from './qnsTradition';
import law from './qnsLaw';

export default [
  fishCulture,
  waterHabitat,
  tradition,
  law
];