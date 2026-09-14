import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-700 space-y-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
              ⚠️
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              عذراً، حدث خطأ غريب أثناء العرض
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              يبدو أن هناك بيانات غير متوافقة في الذاكرة المؤقتة للمتصفح. اضغط على الزر أدناه لإصلاح الذاكرة وإعادة التحميل.
            </p>
            <div className="pt-2 space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-6 bg-brand-green hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                تصفير الجلسة وإعادة التحميل 🔄
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl transition-all"
              >
                إعادة رسم الصفحة فقط
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
