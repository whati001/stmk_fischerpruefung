/**
 * @file qManager.js
 * @description responsible class for handling all question
 *                related stuff
 * @author andreas.karner@student.tugraz.at
 */
import utils from './utils';
import cValue from './const';
import qns from './qnsChapters';

/**
 * @class QLoader
 * @description Load and process everything related to questions
 * @param {*} qns - questions to manage
 */
class QLoader {
  /**
   * @description ctor for {QLoader} class
   * @param {*} qns questions to work with
   */
  constructor(qns) {
    this.action = undefined;
    this.label = undefined;
    this.readOnly = undefined;
    this.qns = this.readQns(qns);
    this.qnsAvailable = (this.qns && this.qns.length > 0);
  }

  /**
   * Load questions into member variable
   * sort the questions by id property
   * @param {*} qns 
   */
  readQns(qns) {
    if (qns && qns.length > 0) {
      return qns.map(cat => {
        cat.qs = cat.qs.sort((a, b) => (a.id > b.id) ? 1 : -1);
        return cat;
      });
    }
    return;
  }

  /**
   * Shuffel all quesions
   */
  shuffelQns() {
    this.qns = this.qns.map(cat => {
      cat.qs = utils.shuffleArray(cat.qs);
      return cat;
    });
  }

  /**
   * Slice questions up to size amount
   * @param {*} size 
   */
  sliceQns(size) {
    this.qns = this.qns.map(cat => {
      cat.qs = cat.qs.slice(0, size);
      return cat;
    });
  }

  /**
   * Little helper methode to init object by action values
   * @param {*} action 
   */
  storeActionValues(action) {
    this.action = action.QUERY || 'notFound';
    this.label = action.LABEL || 'notFound';
    this.readOnly = action.READ_ONLY;
  }

  /**
   * Initialize class for action
   * @param {*} action 
   */
  initAction(action) {
    switch (action) {
      case cValue.ACTION.ACTION.TRAIN.QUERY:
        this.storeActionValues(cValue.ACTION.ACTION.TRAIN);
        this.shuffelQns();
        break;

      case cValue.ACTION.ACTION.EXAM.QUERY:
        this.storeActionValues(cValue.ACTION.ACTION.EXAM);
        this.shuffelQns();
        this.sliceQns(10);
        break;

      case cValue.ACTION.ACTION.QNS.QUERY: {
        this.storeActionValues(cValue.ACTION.ACTION.QNS);
        utils.getDOMElement(cValue.DOM_ID.VALIDATE_INPUT).style.display = 'none';
        break;

      }
      default: {
        console.warn('Unknown action passed, let\'s we will redirect you to the home page');
        window.location.href = new URL(window.location.href).origin;
        return;
      }
    }

    utils.updateInnerText(cValue.DOM_ID.QUIZ_TYPE, this.label);
    if (!this.readOnly) {
      utils.getDOMElement(cValue.DOM_ID.VALIDATE_INPUT).onclick = validateUserInput;
    }
  }

  /**
   * Load action, this methode needs to run after the {initAction} method
   */
  loadAction() {
    if (!this.action) {
      console.warn('Please initialize an action first by calling qManager.initAction() first');
      return;
    }

    this.injectAllQuestions(cValue.DOM_ID.QNS_CONTAINER, this.readOnly);
  }


  /**
   * Inject info text that no quetions go loaded to {QManager} class during initialization
   * @param {*} domContainer 
   */
  injectMissingQnsInfo(domContainer) {
    console.warn('Please define some questions in questions.js');
    const { col } = utils.injectNewRowCol(domContainer, { 'col': 'infoText' });
    const infoText = document.createElement('p');
    infoText.innerText = 'Please define some questions in questions.js';
    col.appendChild(infoText);
  }

  /**
   * Inject new question category card
   * @param {*} domContainer 
   * @param {*} qCat 
   */
  injectQnsCatCard(domContainer, qCat) {
    const card = utils.newDOMElement('div', 'card category-card');
    domContainer.appendChild(card);

    const name = utils.newDOMElement('div', 'card-body');
    card.appendChild(name);
    name.appendChild(utils.newDOMElement('h2', 'card-title', { 'innerText': qCat.name }));

    return card;
  }

  /**
   * Inject new question card with answers
   * @param {*} domContainer 
   * @param {*} q 
   * @param {*} cat 
   * @param {*} readOnly 
   */
  injectQnsCard(domContainer, q, cat, readOnly = false) {
    const card = utils.newDOMElement('div', 'card category-question-card');
    domContainer.appendChild(card);
    if (q.img) {
      const img = utils.newDOMElement('img', 'card-img-top', { 'src': `images/${q.img}` });
      card.appendChild(img);
    }

    const question = utils.newDOMElement('div', 'card-body');
    card.appendChild(question);
    question.appendChild(utils.newDOMElement('h5', 'card-title', { 'innerText': `Frage: ${q.id}` }));
    question.appendChild(utils.newDOMElement('p', 'card-text', { 'innerText': q.q }));

    const answers = utils.newDOMElement('ul', 'list-group');
    card.appendChild(answers);
    Object.keys(q.a).forEach(akey => {
      const answerLi = utils.newDOMElement('li', 'list-group-item');
      answers.appendChild(answerLi);
      const answerDiv = utils.newDOMElement('div', 'form-check');
      answerLi.appendChild(answerDiv);
      const checkbox = utils.newDOMElement('input', 'form-check-input', { 'type': 'radio', 'name': `${cat.id}-${q.id}`, 'value': akey, 'id': `${cat.id}-${q.id}-${akey}` });
      answerDiv.appendChild(checkbox);
      const label = utils.newDOMElement('label', 'form-check-label', { 'innerText': q.a[akey], 'for': `${cat.id}-${q.id}-${akey}` });
      answerDiv.appendChild(label);
      if (readOnly) checkbox.disabled = true;
    });
    return card;
  }

  /**
   * Correct and highlight user result
   * @param {*} card 
   * @param {*} q 
   */
  markCorrectAnswer(card, q) {
    const answer = card.querySelector(`input.form-check-input[value=${q.c}]`);
    if (answer) {
      answer.checked = true;
      const parent = utils.getParentNode(answer, 'li');
      if (parent) parent.classList.add('correctAnswer');
    }
  }

  /**
   * Inject all questions from {QManager} class into dom container
   * @param {*} container 
   * @param {*} readOnly 
   */
  injectAllQuestions(container, readOnly = true) {
    if (!container) {
      console.warn('Please provide an valid DOM container for injecting questions');
      return;
    }
    const domContainer = utils.getDOMElement(container);
    if (!this.qnsAvailable) {
      this.injectMissingQnsInfo(domContainer);
      return;
    }

    this.qns.forEach(cat => {
      const row = utils.injectNewRow(domContainer);
      const col = utils.injectNewCol(row);
      this.injectQnsCatCard(col, cat);
      cat.qs.forEach(q => {
        const row = utils.injectNewRow(domContainer);
        const col = utils.injectNewCol(row);
        const card = this.injectQnsCard(col, q, cat, readOnly);
        if (readOnly) this.markCorrectAnswer(card, q);
      });
    });
  }
}

/**
 * Check all questions if the user answerd correctly
 */
const validateUserInput = () => {
  Array.from(document.getElementsByClassName('category-question-card')).forEach(uq => {
    const ids = uq.querySelector('input').getAttribute('name');
    const catId = parseInt(ids.split('-')[0]);
    const qId = parseInt(ids.split('-')[1]);
    const correct = qns.filter(cat => cat.id === catId)[0].qs.filter(q => q.id === qId)[0].c;

    const userSelected = uq.querySelector('input:checked');
    if (userSelected) {
      if (userSelected.getAttribute('value') !== correct) {
        utils.getParentNode(userSelected, 'li').classList.add('wrongAnswer');
      }
    } else {
      uq.style.color = 'red';
    }
    const correctInput = uq.querySelector(`input[value=${correct}`);
    //correctInput.checked = true;
    utils.getParentNode(correctInput, 'li').classList.add('correctAnswer');
  });
};

export default QLoader;