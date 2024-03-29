export default `<%=#> Component %>
  <%=#*inline "imports-block"%>import { Link } from "@reactionable/router-dom";<%=/inline%>
  <%=#*inline "description-block"%>The page you are looking for might have been removed, or had its name changed, or is temporarily unavailable<%=/inline%>
  <%=#*inline "render-block"%>
    <p>{t("The page you are looking for might have been removed, or had its name changed, or is temporarily unavailable")}</p>
    <p><Link to="/">{t("Go To Homepage")}</Link></p>
  <%=/inline%>
<%=/Component%>`;
