export type RunnableOptions = Record<string, string | boolean | undefined>;

export interface RunnableAction<O extends RunnableOptions> {
  run: (options: O) => Promise<void>;
}
