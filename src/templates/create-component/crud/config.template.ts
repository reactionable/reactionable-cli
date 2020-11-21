export default `{ 
    "{{componentDirPath}}/{{entitiesName}}Config.tsx": "Config.tsx",
    "{{i18nPath}}": {
        "locales/en/{{camelize entitiesName }}.json": "locales/en/crud.json",
        "locales/fr/{{camelize entitiesName }}.json": "locales/fr/crud.json"
    }
}`;
