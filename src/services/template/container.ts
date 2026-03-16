import "reflect-metadata";

import { Container } from "inversify";

import { EtaAdapter } from "./adapters/EtaAdapter";
import { TemplateAdapterHelper } from "./adapters/TemplateAdapterHelper";

export const AdapterIdentifier = Symbol.for("TemplateAdapter");

export function bindTemplateAdapters(container: Container): void {
  container.bind<TemplateAdapterHelper>(TemplateAdapterHelper).toSelf();
  container.bind<EtaAdapter>(EtaAdapter).toSelf();
  container.bind<EtaAdapter>(AdapterIdentifier).toService(EtaAdapter);
}
