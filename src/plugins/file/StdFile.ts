import { safeWriteFile } from '../File';

export class StdFile {

    constructor(
        protected file: string | null = null,
        protected encoding: string = 'utf8',
        protected content: string = '',
    ) { }

    getContent(): string {
        return this.content;
    }

    async saveFile(file: string | null = null, encoding: string | null = null): Promise<void> {
        if (file === null) {
            if (this.file === null) {
                throw new Error('A file path is mandatory to save file');
            }
            file = this.file;
        }

        return safeWriteFile(
            file,
            this.getContent(),
            encoding === null ? this.encoding : encoding
        );
    }

}