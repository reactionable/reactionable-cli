import { injectable } from 'inversify';

import { AbstractAdapterWithPackageAction } from '../../AbstractAdapterWithPackageAction';
import { UIFrameworkAdapter } from './UIFrameworkAdapter';

@injectable()
export default class UIMaterial
  extends AbstractAdapterWithPackageAction
  implements UIFrameworkAdapter {
  protected name = 'UI Material (Material-UI integration)';
  protected adapterPackageName = '@reactionable/ui-material';
}
