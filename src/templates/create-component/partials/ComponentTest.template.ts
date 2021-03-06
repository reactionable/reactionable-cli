export default `import React from "react";
import { render } from "@testing-library/react";
import { i18nTestInstance } from "@reactionable/core";
import { useUIProviderProps, IUIProviderProps } from "{{ uiPackage }}";
import { TestWrapper } from "{{ routerPackage }}";
import { useIdentityProviderProps, IIdentityProviderProps } from "{{ hostingPackage }}";
{{#> imports-block}}
{{!-- Custom imports could be added. --}}
{{/imports-block}}
import {{ componentName }} from "./{{ componentName }}";

describe("{{ componentName }}", () => {

    let identity: IIdentityProviderProps;
    let ui: IUIProviderProps;

    beforeAll(async () => {
        await i18nTestInstance();
        identity = useIdentityProviderProps();
        ui = useUIProviderProps();
    });

    it("renders without crashing", () => {
        const result = render(
            <TestWrapper identity={identity} ui={ui}>
                <{{ componentName }} />
            </TestWrapper>
        );

        expect(result).toBeTruthy();
    });
});`;
