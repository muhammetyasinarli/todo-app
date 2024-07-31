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
          "addProduct": "Write a note",
          "todaysTasks": "My Notes",
          "pastTasks" : "Past Tasks",
          "hidePastTasks" : "Hide Past",
          "showPastTasks" : "Show Past"
        }
      },
      tr: {
        translation: {
          "addProduct": "Not Yaz",
          "todaysTasks": "Notlarım",
          "pastTasks" : "Geçmiş Görevlerim",
          "hidePastTasks" : "Geçmişi Gizle",
          "showPastTasks" : "Geçmişi Göster"
        }
      }
    }
  });

export default i18n;
