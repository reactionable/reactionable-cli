import "reflect-metadata";

import { Container } from "inversify";

import { CliService } from "./services/CliService";
import { ConsoleService } from "./services/ConsoleService";
import { FileDiffService } from "./services/file/FileDiffService";
import { FileFactory } from "./services/file/FileFactory";
import { FileService } from "./services/file/FileService";
import { DirectoryService } from "./services/file/DirectoryService";
import { GitService } from "./services/git/GitService";
import { PackageManagerService } from "./services/package-manager/PackageManagerService";
import { bindTemplateAdapters } from "./services/template/container";
import { TemplateFileService } from "./services/template/TemplateFileService";
import { TemplateService } from "./services/template/TemplateService";
import { ColorService } from "./services/ColorService";
import { bindActions } from "./actions/container";

const container = new Container({ defaultScope: "Singleton" });

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
