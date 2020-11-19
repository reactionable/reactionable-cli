import { initializeI18n } from '@reactionable/core';

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

initializeI18n({ resources });
