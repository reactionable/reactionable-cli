export interface IRunnable<O = any> {
    run: (options: O) => Promise<void>,
}