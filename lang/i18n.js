// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'tr',
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          "addProduct": "Write a task",
          "todaysTasks": "My Tasks",
          "pastTasks" : "Past Tasks"
        }
      },
      tr: {
        translation: {
          "addProduct": "Görev Yaz",
          "todaysTasks": "Görevlerim",
          "pastTasks" : "Geçmiş Görevlerim"
        }
      }
    }
  });

export default i18n;
