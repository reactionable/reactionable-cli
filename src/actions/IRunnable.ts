export type IOptions = { [key: string]: string | boolean | undefined };

export interface IRunnable<O extends IOptions> {
    run: (options: O) => Promise<void>,
}