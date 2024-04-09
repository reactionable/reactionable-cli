import { join, resolve } from "path";

import container from "../../../container";
import { TemplateContext } from "../TemplateContext";
import { EtaAdapter } from "./EtaAdapter";

describe("EtaAdapter", () => {
  let etaAdapter: EtaAdapter;

  beforeEach(() => {
    // Initialize service before each test to not be confused by cache
    container.snapshot();
    etaAdapter = container.get(EtaAdapter);
  });

  afterEach(() => {
    container.restore();
  });

  describe("renderTemplateString", () => {
    it("should render a simple template string", async () => {
      const template = "Hello, <%= it.name %>!";
      const context: TemplateContext = { name: "World" };
      const expectedOutput = "Hello, World!";
      const output = await etaAdapter.renderTemplateString(template, context);
      expect(output).toEqual(expectedOutput);
    });

    it("should throw an error if the template is invalid", async () => {
      const template = "Hello, <%= name %!";
      const context: TemplateContext = { name: "World" };
      await expect(etaAdapter.renderTemplateString(template, context)).rejects.toThrow(
        /An error occurred while compiling template "Hello, <%= name %!": EtaParser Error: unclosed tag at line 1 col 8:.*/
      );
    });
  });

  describe("renderTemplateFile", () => {
    it("should render a simple template file", async () => {
      const templateKey = "i18n/i18n.ts";
      const context: TemplateContext = {};
      const output = await etaAdapter.renderTemplateFile(templateKey, context);
      expect(output).toBeTruthy();
    });

    it("should render a template file with partials", async () => {
      const templateKey = "create-component/standalone/Standalone.tsx";
      const context: TemplateContext = {
        routerPackage: "@reactionable/router-next",
      };
      const output = await etaAdapter.renderTemplateFile(templateKey, context);
      expect(output).toBeTruthy();
    });

    it("should throw an error if the template file is not found", async () => {
      const templateKey = "non-existent-template";
      const context: TemplateContext = { name: "World" };
      await expect(etaAdapter.renderTemplateFile(templateKey, context)).rejects.toThrow(
        `Template file "${resolve(
          join(__dirname, "../../../..")
        )}/src/templates/non-existent-template.template.ts" does not exist`
      );
    });
  });
});
