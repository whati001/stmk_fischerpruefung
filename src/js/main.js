import qs from './questions';
import utils from './utils';
import cValue from './const';
import QLoader from './qLoader';

/** 
 * Executed after page is ready
 */
window.onload = function() {
  const action = utils.getUrlParamsValue(cValue.ACTION_NAME);
  console.debug(`Start to load action: ${action}`);

  switch (action) {
    case 'train':
      break;
    case 'exam':
      break;
    case 'show': {
      const qLoader = new QLoader(qs);
      qLoader.injectAllQuestions('qsContainer');
      break;
    }
    default: {
      console.warn('Unknown action passed, let\'s we will redirect you to the home page');
      window.location.href = new URL(window.location.href).origin;
      break;
    }
  }
};
