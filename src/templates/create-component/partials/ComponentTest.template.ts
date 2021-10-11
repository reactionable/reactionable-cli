export default `import React from "react";
import { render } from "@testing-library/react";
import { i18nTestInstance } from "@reactionable/core";
import { useUIProviderProps, IUIProviderProps } from "<%= it.uiPackage %>";
import { TestWrapper } from "<%= it.routerPackage %>";
import { useIdentityProviderProps, IIdentityProviderProps } from "<%= it.hostingPackage %>";
<%= it.importsBlock || '' %>
import <%= it.componentName %> from "./<%= it.componentName %>";

describe("<%= it.componentName %>", () => {

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
                <<%= it.componentName %> />
            </TestWrapper>
        );

        expect(result).toBeTruthy();
    });
});`;
