import { IRealpathRunnable } from '../../IRealpathRunnable';

export interface IHostingAction extends IRealpathRunnable {
    getName: () => string,
}