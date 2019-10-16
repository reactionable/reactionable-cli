import { IRealpathRunnable } from '../../../IRealpathRunnable';

export interface IUIFrameworkAction extends IRealpathRunnable {
    getName: () => string;
}