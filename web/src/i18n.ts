import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      hello: "Hello",
      dashboard: "Dashboard",
      settings: "Settings",
      logout: "Logout",
      welcome: "Welcome to KidsWorld",
      toggle_theme: "Toggle Theme",
      toggle_language: "عربي",
      loading: "Loading...",
      error_occurred: "An error occurred",
      retry: "Retry",
      no_data: "No data available",
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      login_title: "Sign In",
      email_label: "Email Address",
      password_label: "Password",
      login_button: "Log In",
      forgot_password: "Forgot your password?",
      change_temp_password: "Change Temporary Password",
      new_password: "New Password",
      confirm_password: "Confirm Password"
    }
  },
  ar: {
    translation: {
      hello: "مرحباً",
      dashboard: "لوحة القيادة",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      welcome: "مرحباً بكم في كيدز وورلد",
      toggle_theme: "تبديل المظهر",
      toggle_language: "English",
      loading: "جاري التحميل...",
      error_occurred: "حدث خطأ",
      retry: "إعادة المحاولة",
      no_data: "لا توجد بيانات",
      submit: "إرسال",
      cancel: "إلغاء",
      save: "حفظ",
      login_title: "تسجيل الدخول",
      email_label: "البريد الإلكتروني",
      password_label: "كلمة المرور",
      login_button: "دخول",
      forgot_password: "هل نسيت كلمة المرور؟",
      change_temp_password: "تغيير كلمة المرور المؤقتة",
      new_password: "كلمة المرور الجديدة",
      confirm_password: "تأكيد كلمة المرور"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

// Update the HTML dir attribute whenever the language changes
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

// Set initial dir
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

export default i18n;
