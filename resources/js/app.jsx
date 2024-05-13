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
  progress: {
    // The delay after which the progress bar will appear, in milliseconds...
    delay: 250,
    // The color of the progress bar...
    color: '#ff0000',
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <LayoutProvider>
        <App {...props} />
      </LayoutProvider>
    )
  },
})