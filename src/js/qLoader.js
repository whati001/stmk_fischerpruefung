import utils from './utils';

/**
 * QLoader - Question Loader
 * Load and process everything related to questions
 */
class QLoader {
  constructor(qs) {
    this.qs = this.readQs(qs);
    this.qsAvailable = (this.qs && this.qs.length > 0);
  }

  readQs(qs) {
    if (qs && qs.length > 0) {
      return qs.map(cat => {
        cat.qs = cat.qs.sort((a, b) => (a.id > b.id) ? 1 : -1);
        return cat;
      });
    }
    return;
  }

  shuffelQs() {
    this.qs = this.qs.map(cat => {
      cat.qs = utils.shuffleArray(cat.qs);
      return cat;
    });
  }

  sliceQs(size) {
    this.qs = this.qs.map(cat => {
      cat.qs = cat.qs.slice(0, size);
      return cat;
    });
  }

  injectMissingQsInfo(domContainer) {
    console.warn('Please define some questions in questions.js');
    const { col } = utils.injectNewRowCol(domContainer, { 'col': 'infoText' });
    const infoText = document.createElement('p');
    infoText.innerText = 'Please define some questions in questions.js';
    col.appendChild(infoText);
  }

  injectQCatCard(domContainer, qCat) {
    const card = utils.newDOMElement('div', 'card category-card');
    domContainer.appendChild(card);

    const name = utils.newDOMElement('div', 'card-body');
    card.appendChild(name);
    name.appendChild(utils.newDOMElement('h2', 'card-title', { 'innerText': qCat.name }));

    return card;
  }

  injectQCard(domContainer, q, cat, readOnly = false) {
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

  markCorrectAnswer(card, q) {
    const answer = card.querySelector(`input.form-check-input[value=${q.c}]`);
    if (answer) {
      answer.checked = true;
      const parent = utils.getParentNode(answer, 'li');
      if (parent) parent.classList.add('correctAnswer');
    }
  }

  injectAllQuestions(container, readOnly = true) {
    if (!container) {
      console.warn('Please provide an valid DOM container for injecting questions');
      return;
    }
    const domContainer = utils.getDOMElement(container);
    if (!this.qsAvailable) {
      this.injectMissingQsInfo(domContainer);
      return;
    }

    this.qs.forEach(cat => {
      const row = utils.injectNewRow(domContainer);
      const col = utils.injectNewCol(row);
      this.injectQCatCard(col, cat);
      cat.qs.forEach(q => {
        const row = utils.injectNewRow(domContainer);
        const col = utils.injectNewCol(row);
        const card = this.injectQCard(col, q, cat, readOnly);
        if (readOnly) this.markCorrectAnswer(card, q);
      });
    });
  }
}


export default QLoader;