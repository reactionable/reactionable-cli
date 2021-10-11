export default `import { initializeI18n } from '<%= it.hostingPackage %>';

import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';

const resources = {
  en: {
    common: enCommon,
  },
  fr: {
    common: frCommon,
  },
};

initializeI18n({ resources });`;
