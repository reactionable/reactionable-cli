import { IRealpathRunnable } from '../../IRealpathRunnable';

export interface IVersioningAction extends IRealpathRunnable {
    getName: () => string,
}