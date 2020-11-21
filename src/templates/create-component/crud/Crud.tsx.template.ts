export default `{{#> Component }}
{{#*inline "imports-head-block"}}{{/inline}}
{{#*inline "imports-block"}}
import { lazy } from "react";
import { Crud } from "@reactionable/core";

import { I{{ entityName }}Data } from "./{{ entitiesName }}Config";
const List{{ entitiesName }} = lazy(() => import("./list-{{hyphenize entitiesName }}/List{{ entitiesName }}"));
const Read{{ entityName }} = lazy(() => import("./read-{{hyphenize entityName }}/Read{{ entityName }}"));
{{/inline}}
{{#*inline "head-block"}}{{/inline}}
{{#*inline "render-block-title"}}{{/inline}}
{{#*inline "render-block"}}<Crud<I{{ entityName }}Data>
      name="{{ entityName }}"
      listComponent={ List{{ entitiesName }} }
      readComponent={ Read{{ entityName }} }
      {...props}
    />{{/inline}}
{{/Component}}`;
