import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';
import { ThemeProvider } from './components/ui/ThemeProvider';
import AppRoutes from './routes/AppRoutes';
import { MoFreshAssistant } from './components/MoFreshAssistant';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
          <MoFreshAssistant />
          <AppRoutes />
        </div>
      </ThemeProvider>
    </I18nextProvider>
  );
}