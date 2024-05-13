import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import '../css/app.css'
 import 'react-toastify/dist/ReactToastify.css';
import { LayoutProvider } from './context/Layout'

createInertiaApp({
  title: title => `${title}minia admin`,
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
    return pages[`./Pages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <LayoutProvider>
        <App {...props} />
      </LayoutProvider>
    )
  },
})