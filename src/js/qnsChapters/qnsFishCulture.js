/**
 * @file qFishCulture
 * @description all questions about fish and there culture 
 * @author andreas.karner@student.tugraz.at
 */

export default {
  id: 1,
  name: 'Fischkunde- und hege',
  qs: [
    {
      id: 1,
      q: 'Bitte benenne Sie den Fisch im Bild',
      img: 'fishHechtDemo.jpg',
      a: {
        'a': 'Hecht',
        'b': 'Kapfen',
        'c': 'Aal'
      },
      c: 'a'
    }, {
      id: 2,
      q: 'Bitte kreuzen Sie die richtige Antwort an:',
      a: {
        a: 'Ihre Werbung bitte hier einfuegen.',
        b: 'Ihre Falsche Antwort koennte hier stehen.',
        c: 'Kapfen haben im Gegensatz zu Hechte Bartln.'
      },
      c: 'c'
    }
  ]
};
