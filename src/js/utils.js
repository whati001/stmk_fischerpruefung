/**
 * @file utils.js
 * @description Some utilities which will make the life easier
 * @author andreas.karner@student.tugraz.at
 */

/**
* Parse value from query parameter and return it,
* if the params is not defined in the querystring, it returns an empty string
* @param {*} param 
* @param {*} href 
*/
const getUrlParamsValue = (param, href = window.location.href) => {
  if (param) {
    const url = new URL(href);
    return new URLSearchParams(url.search.slice(1)).get(param);
  } else {
    console.warn('You have requested an empty params to search in querystring.');
    return '';
  }
};

/**
 * Return the elm defined either by id, classname 
 * or DOMNode as DOMNode
 * @param {*} elm 
 */
const getDOMElement = (elm) => {
  if (!elm) {
    return undefined;
  } else if (elm instanceof Node) {
    return elm;
  } else if (typeof elm === 'string') {
    const idNode = document.getElementById(elm);
    if (idNode) return idNode;
    const classNodes = document.getElementsByClassName(elm);
    if (classNodes && classNodes.length > 0) return classNodes.first;
  }
  return undefined;
};

/**
* Update innerText attribute from elm
* keep vDom unchanged if elm not found
* @param {*} param 
* @param {*} href 
*/
const updateInnerText = (elm, text) => {
  const dom = getDOMElement(elm);
  if (dom && text) {
    dom.innerText = text;
  }
};

/**
 * Return a new DOMNode from given type and set classes
 * @param {*} type 
 * @param {*} classes 
 */
const newDOMElement = (type, classes = '', attr = {}) => {
  const elm = document.createElement(type);
  if (!elm) return undefined;
  if (typeof classes === 'string' && classes !== '') {
    elm.setAttribute('class', classes);
  }
  Object.keys(attr).forEach(key => {
    if (key === 'innerText') {
      elm.innerText = attr[key];
    } else {
      elm.setAttribute(key, attr[key]);
    }
  });
  return elm;
};

/**
 * Inject new bootstrap row div into container
 * @param {*} container 
 * @param {*} classNames 
 */
const injectNewRow = (container, classes = undefined) => {
  const dom = getDOMElement(container);
  const domClass = dom.getAttribute('class') ? dom.getAttribute('class') : '';
  if (!dom || !domClass.includes('container')) {
    console.warn('Please provide an valid container for inserting a new row');
    return;
  }
  const row = newDOMElement('div', (classes && classes !== '') ? `row ${classes}` : 'row');
  dom.appendChild(row);
  return row;
};

/**
 * Inject new bootstrap col div into row
 * @param {*} container 
 * @param {*} classes 
 */
const injectNewCol = (row, classes = undefined) => {
  const dom = getDOMElement(row);
  const domClass = dom.getAttribute('class') ? dom.getAttribute('class') : '';
  if (!dom || !domClass.includes('row')) {
    console.warn('Please provide an valid row for inserting a new col');
    return;
  }
  const col = newDOMElement('div', (classes && classes !== '') ? `col ${classes}` : 'col');
  dom.appendChild(col);
  return col;
};

/**
 * Insert a new row col construct
 * Please pass the class to use for each wrapped in an object
 * with keys [row, col], this method returns an object with [row, col]
 * values. If inserting fails, it removes all created DOMNodes
 * @param {*} container 
 * @param {*} classes 
 */
const injectNewRowCol = (container, classes = {}) => {
  const row = injectNewRow(container, classes.row);
  console.log(row);
  if (row) {
    const col = injectNewCol(row, classes.col);
    console.log(col);
    if (col) {
      return { 'row': row, 'col': col };
    }
    getDOMElement(container).removeChild(row);
  }
  return undefined;
};

/**
 * Iterate until maxDepth is reached and try to find the parentNode
 * with the tagname
 * @param {*} domNode 
 * @param {*} parentTagname 
 * @param {*} maxDepth 
 */
const getParentNode = (domNode, tagname, maxDepth = 10) => {
  let curNode = domNode;
  for (let i = 0; i < maxDepth; i++) {
    if (curNode.tagName.toLowerCase() === tagname.toLowerCase()) return curNode;
    curNode = curNode.parentNode;
  }
  return;
};

/**
 * Shuffel array based on Fisher-Yates Shuffle algorithm
 * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 * @param {*} array
 */
const shuffleArray = (array) => {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
};

/**
 * Do lazy load for entire page
 */
const doLazyLoad = () => {
  const elms = document.querySelectorAll('img[data-lazysrc]');
  if (!elms) return;

  Array.from(elms).forEach(elm => {
    elm.setAttribute('src', elm.getAttribute('data-lazysrc'));
  });
};


export default {
  getUrlParamsValue,
  getDOMElement,
  updateInnerText,
  newDOMElement,
  injectNewRow,
  injectNewCol,
  injectNewRowCol,
  getParentNode,
  shuffleArray,
  doLazyLoad
};