export default `{ 
    "<%= it.componentDirPath %>/<%= it.entitiesName %>Config.tsx": "Config.tsx",
    "<%= it.i18nPath %>": {
        "locales/en/<%= it.camelize(it.entitiesName) %>.json": "locales/en/crud.json",
        "locales/fr/<%= it.camelize(it.entitiesName) %>.json": "locales/fr/crud.json"
    }
}`;
