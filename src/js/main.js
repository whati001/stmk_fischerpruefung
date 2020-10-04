/**
 * @file main.js
 * @description main js entry point
 * @author andreas.karner@student.tugraz.at
 */

import qns from './qnsChapters';
import utils from './utils';
import cValue from './const';
import qManager from './qManager';

/** 
 * Executed after page is ready
 */
window.onload = function() {
  const action = utils.getUrlParamsValue(cValue.ACTION.QUERY_NAME);

  const qLoader = new qManager(qns);
  qLoader.initAction(action);
  qLoader.loadAction();
};
