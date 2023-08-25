export default `<%

const imports = \`import { lazy } from "react";
import { Crud } from "@reactionable/core";

import { I<%= it.entityName %>Data } from "./<%= it.entitiesName %>Config";
const List<%= it.entitiesName %> = lazy(() => import("./list-<%= it.hyphenize(it.entitiesName) %>/List<%= it.entitiesName %>"));
const Read<%= it.entityName %> = lazy(() => import("./read-<%= it.hyphenize(it.entityName) %>/Read<%= it.entityName %>"));\`;

const render = \`<Crud<I<%= it.entityName %>Data>
name="<%= it.entityName %>"
listComponent={ List<%= it.entitiesName %> }
readComponent={ Read<%= it.entityName %> }
{...props}
/>\`;

%>

<%= include("@Component", {
  ...it,
  blocks: {
    importsHead: null,
    imports,
    head: null,
    renderTitle: null,
    render
  }
}) %>`;
