import "reflect-metadata";

import type { Container } from "inversify";
import type { UIFrameworkAdapter } from "./adapters/UIFrameworkAdapter.js";
import UIBootstrap from "./adapters/ui-bootstrap/UIBootstrap.js";
import UIMaterial from "./adapters/ui-material/UIMaterial.js";

export const AdapterIdentifier = Symbol.for("UIFrameworkAdapter");

export function bindUIFrameworkAdapters(container: Container): void {
	container.bind<UIFrameworkAdapter>(AdapterIdentifier).to(UIBootstrap);
	container.bind<UIFrameworkAdapter>(AdapterIdentifier).to(UIMaterial);
}
