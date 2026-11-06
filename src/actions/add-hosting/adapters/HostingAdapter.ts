import type { AdapterActionOptions } from "../../AbstractAdapterAction.js";
import type { AdapterAction } from "../../AdapterAction.js";

export type HostingAdapterOptions = AdapterActionOptions;

export type HostingAdapter<
	O extends HostingAdapterOptions = HostingAdapterOptions,
> = AdapterAction<O>;
