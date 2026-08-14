import "reflect-metadata";

import type { Container } from "inversify";

import Github from "./adapters/github/Github";
import type { VersioningAdapter } from "./VersioningAdapter";

export const AdapterIdentifier = Symbol("VersioningAdapter");

export function bindVersioningAdapters(container: Container): void {
	container.bind(Github).toSelf();
	container.bind<VersioningAdapter>(AdapterIdentifier).toService(Github);
}
