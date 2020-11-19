import { injectable } from 'inversify';

import { AbstractAdapterWithPackageAction } from '../../AbstractAdapterWithPackageAction';
import { RouterAdapter } from './RouterAdapter';

@injectable()
export default class NextJs extends AbstractAdapterWithPackageAction implements RouterAdapter {
  protected name = 'NextJS (NextJs routing integration)';
  protected adapterPackageName = '@reactionable/nextjs';
}
