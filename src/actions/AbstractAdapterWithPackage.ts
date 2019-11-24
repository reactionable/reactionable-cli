
import { hasInstalledPackage, installPackages } from '../plugins/package/Package';
import { AbstractAdapter } from './AbstractAdapter';
import { IOptions } from './IRunnable';
import { injectable } from 'inversify';

@injectable()
export abstract class AbstractAdapterWithPackage<O extends IOptions = {}> extends AbstractAdapter<O> {

    protected abstract packageName: string;

    getPackageName(): string {
        return this.packageName;
    }

    async isEnabled(realpath: string): Promise<boolean> {
        return hasInstalledPackage(realpath, this.getPackageName());
    }

    async run({ realpath }) {
        // Installs package      
        await installPackages(realpath, [this.getPackageName()]);
    }
}