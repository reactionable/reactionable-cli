import { AdapterActionOptions } from '../../AbstractAdapterAction';
import { AdapterAction } from '../../AdapterAction';

export type HostingAdapterOptions = AdapterActionOptions;

export type HostingAdapter<O extends HostingAdapterOptions = HostingAdapterOptions> = AdapterAction<
  O
>;
