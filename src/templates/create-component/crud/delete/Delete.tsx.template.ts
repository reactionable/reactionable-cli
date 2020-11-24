export default `{{#> Component }}
{{#*inline "imports-head-block"}}{{/inline}}
{{#*inline "imports-block"}}
import { Delete, IDeleteProps } from "{{ uiPackage }}";

import { I{{ entityName }}Data, use{{ entitiesName }}Config } from "../{{ entitiesName }}Config";
{{/inline}}
{{#*inline "props-block"}}type IDelete{{ entityName }}Props = {
  id: string; 
  onSuccess?: IDeleteProps<I{{ entityName }}Data>["onSuccess"];
  label?: boolean;
};{{/inline}}
{{#*inline "head-block"}}{{/inline}}
{{#*inline "pre-render-block"}}const { id, label, ...deleteProps} = props;
  const { onDelete } = use{{ entitiesName }}Config();
{{/inline}}
{{#*inline "render-block-title"}}{{/inline}}
{{#*inline "render-block"}}<Delete
      {...deleteProps}
      title={t("Delete {{decamelize entityName }}")}
      confirmationMessage={t("Are you sure you want to delete this {{decamelize entityName }} ?")}
      successMessage={t("The {{decamelize entityName }} has been deleted")}
      onConfirm={() => onDelete(id)}
    >
      {label ? t("Delete {{decamelize entityName }}") : undefined}
    </Delete>{{/inline}}
{{/Component}}`;
