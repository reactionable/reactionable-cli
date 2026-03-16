import "reflect-metadata";

import { Container } from "inversify";

import Github from "./adapters/github/Github";
import { VersioningAdapter } from "./VersioningAdapter";

export const AdapterIdentifier = Symbol("VersioningAdapter");

export function bindVersioningAdapters(container: Container): void {
  container.bind(Github).toSelf();
  container.bind<VersioningAdapter>(AdapterIdentifier).toService(Github);
}
