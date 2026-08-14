import type { AdapterActionOptions } from "../../AbstractAdapterAction";
import type { AdapterAction } from "../../AdapterAction";

export type HostingAdapterOptions = AdapterActionOptions;

export type HostingAdapter<
	O extends HostingAdapterOptions = HostingAdapterOptions,
> = AdapterAction<O>;
