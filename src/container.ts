import "reflect-metadata";

import { Container } from "inversify";
import { bindActions } from "./actions/container.js";
import { CliService } from "./services/CliService.js";
import { ColorService } from "./services/ColorService.js";
import { ConsoleService } from "./services/ConsoleService.js";
import { DirectoryService } from "./services/file/DirectoryService.js";
import { FileDiffService } from "./services/file/FileDiffService.js";
import { FileFactory } from "./services/file/FileFactory.js";
import { FileService } from "./services/file/FileService.js";
import { GitService } from "./services/git/GitService.js";
import { PackageManagerService } from "./services/package-manager/PackageManagerService.js";
import { bindTemplateAdapters } from "./services/template/container.js";
import { TemplateFileService } from "./services/template/TemplateFileService.js";
import { TemplateService } from "./services/template/TemplateService.js";

const container = new Container({ defaultScope: "Singleton" });
container.bind(Container).toConstantValue(container);

// Services
container.bind<PackageManagerService>(PackageManagerService).toSelf();
container.bind<GitService>(GitService).toSelf();
container.bind<TemplateFileService>(TemplateFileService).toSelf();
container.bind<TemplateService>(TemplateService).toSelf();
container.bind<ConsoleService>(ConsoleService).toSelf();
container.bind<FileService>(FileService).toSelf();
container.bind<DirectoryService>(DirectoryService).toSelf();
container.bind<FileDiffService>(FileDiffService).toSelf();
container.bind<FileFactory>(FileFactory).toSelf();
container.bind<CliService>(CliService).toSelf();
container.bind<ColorService>(ColorService).toSelf();

// Bind actions
bindActions(container);

// Bind adapters
bindTemplateAdapters(container);

export default container;
