import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Locale imports
import zhCommon from './locales/zh/common.json'
import zhSetup from './locales/zh/setup.json'
import zhChat from './locales/zh/chat.json'
import zhDashboard from './locales/zh/dashboard.json'
import zhChannels from './locales/zh/channels.json'
import zhSettings from './locales/zh/settings.json'
import zhSkills from './locales/zh/skills.json'

import enCommon from './locales/en/common.json'
import enSetup from './locales/en/setup.json'
import enChat from './locales/en/chat.json'
import enDashboard from './locales/en/dashboard.json'
import enChannels from './locales/en/channels.json'
import enSettings from './locales/en/settings.json'
import enSkills from './locales/en/skills.json'

const resources = {
  zh: {
    common: zhCommon,
    setup: zhSetup,
    chat: zhChat,
    dashboard: zhDashboard,
    channels: zhChannels,
    settings: zhSettings,
    skills: zhSkills,
  },
  en: {
    common: enCommon,
    setup: enSetup,
    chat: enChat,
    dashboard: enDashboard,
    channels: enChannels,
    settings: enSettings,
    skills: enSkills,
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',  // Default to Chinese
    fallbackLng: 'zh',
    defaultNS: 'common',
    ns: ['common', 'setup', 'chat', 'dashboard', 'channels', 'settings', 'skills'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n

export function changeLanguage(lang: 'zh' | 'en'): void {
  i18n.changeLanguage(lang)
}
