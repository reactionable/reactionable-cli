import "reflect-metadata";

import { Container } from "inversify";

import UIBootstrap from "./adapters/ui-bootstrap/UIBootstrap";
import { UIFrameworkAdapter } from "./adapters/UIFrameworkAdapter";
import UIMaterial from "./adapters/ui-material/UIMaterial";

export const AdapterKey = "UIFrameworkAdapter";

export function bindUIFrameworkAdapters(container: Container): void {
  container.bind<UIFrameworkAdapter>(AdapterKey).to(UIBootstrap);
  container.bind<UIFrameworkAdapter>(AdapterKey).to(UIMaterial);
}
