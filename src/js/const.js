/**
 * @file const.js
 * @description const value definitions should go inside here
 * @author andreas.karner@student.tugraz.at
 */

export default {
  ACTION: {
    QUERY_NAME: 'action',
    ACTION: {
      TRAIN: {
        QUERY: 'train',
        LABEL: 'Training',
        READ_ONLY: false
      },
      EXAM: {
        QUERY: 'exam',
        LABEL: 'Pruefung',
        READ_ONLY: false
      },
      QNS: {
        QUERY: 'qns',
        LABEL: 'Fragen',
        READ_ONLY: true
      }
    }
  },
  DOM_ID: {
    QUIZ_TYPE: 'quizType',
    VALIDATE_INPUT: 'validateInput',
    QNS_CONTAINER: 'qnsContainer'
  }
};