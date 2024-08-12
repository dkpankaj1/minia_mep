import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
import 'react-toastify/dist/ReactToastify.css';
import { LayoutProvider } from './context/Layout'

createInertiaApp({
  title: title => `${title}minia admin`,
  resolve: name => {
    const pages = import.meta.glob(['./Pages/**/*.jsx', './Pages/**/*.tsx'], { eager: true });
    return pages[`./Pages/${name}.jsx`] || pages[`./Pages/${name}.tsx`];
  },
  progress: {
    delay: 250,
    color: '#ff0000',
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <LayoutProvider>
        <App {...props} />
      </LayoutProvider>
    )
  },
});
