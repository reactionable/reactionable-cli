import "reflect-metadata";

import { Container } from "inversify";

import Github from "./adapters/github/Github";
import { VersioningAdapter } from "./VersioningAdapter";

export const AdapterIdentifier = Symbol("VersioningAdapter");

export function bindVersioningAdapters(container: Container): void {
  container.bind<VersioningAdapter>(AdapterIdentifier).to(Github);
  container.bind(Github).toSelf();
}
