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

  const qLoader = new QLoader(qs);
  switch (action) {
    case 'train':
      qLoader.shuffelQs();
      qLoader.injectAllQuestions('qsContainer', false);

      // TODO: better solution, but I am running out of time
      document.getElementById('quizType').innerText = 'Training';
      document.getElementById('validateInput').onclick = validateUserInput;
      break;
    case 'exam':
      qLoader.shuffelQs();
      qLoader.sliceQs(10);
      qLoader.injectAllQuestions('qsContainer', false);

      // TODO: better solution, but I am running out of time
      document.getElementById('quizType').innerText = 'Pruefung';
      document.getElementById('validateInput').onclick = validateUserInput;
      break;
    case 'show': {
      qLoader.injectAllQuestions('qsContainer');
      document.getElementById('quizType').innerText = 'Fragen';
      document.getElementById('validateInput').style.display = 'none';
      break;
    }
    default: {
      console.warn('Unknown action passed, let\'s we will redirect you to the home page');
      window.location.href = new URL(window.location.href).origin;
      break;
    }
  }
};


/**
 * Check all questions if the user answerd correctly
 */
const validateUserInput = () => {
  console.log(qs);
  Array.from(document.getElementsByClassName('category-question-card')).forEach(uq => {
    const ids = uq.querySelector('input').getAttribute('name');
    const catId = parseInt(ids.split('-')[0]);
    const qId = parseInt(ids.split('-')[1]);
    console.log(ids);
    console.log(catId);
    console.log(qId);
    console.log(qs.filter(cat => cat.id === catId));

    const correct = qs.filter(cat => cat.id === catId)[0].qs.filter(q => q.id === qId)[0].c;
    console.log(correct);
    console.log(uq);

    const userSelected = uq.querySelector('input:checked');
    if (userSelected) {
      if (userSelected.getAttribute('value') !== correct) {
        utils.getParentNode(userSelected, 'li').classList.add('wrongAnswer');
      }
    }
    const correctInput = uq.querySelector(`input[value=${correct}`);
    correctInput.checked = true;
    utils.getParentNode(correctInput, 'li').classList.add('correctAnswer');
  });
};