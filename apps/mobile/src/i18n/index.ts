import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: {
      login: "Login",
      email: "Email",
      password: "Password",
      submit: "Submit",
      admin_dashboard: "Admin Dashboard",
      teacher_dashboard: "Teacher Dashboard",
      parent_dashboard: "Parent Dashboard",
      logout: "Logout",
    }
  },
  ar: {
    translation: {
      login: "تسجيل الدخول",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      submit: "إرسال",
      admin_dashboard: "لوحة تحكم المشرف",
      teacher_dashboard: "لوحة تحكم المعلم",
      parent_dashboard: "لوحة تحكم ولي الأمر",
      logout: "تسجيل الخروج",
    }
  }
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem('userLanguage');
  if (!savedLanguage) {
    savedLanguage = 'en'; // default
  }

  // Force RTL in React Native if Arabic is selected
  const isRTL = savedLanguage === 'ar';
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // require restart to apply RTL changes on Android/iOS natively but we skip for now
  }

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, 
      }
    });
};

initI18n();

export default i18n;
