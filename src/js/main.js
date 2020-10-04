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
 * Initialize qManager and load selected action
 */
window.onload = function() {
  const action = utils.getUrlParamsValue(cValue.ACTION.QUERY_NAME);

  const app = new qManager(qns);
  app.initAction(action);
  app.loadAction();
};
