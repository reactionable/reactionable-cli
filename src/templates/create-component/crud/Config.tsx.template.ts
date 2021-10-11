export default `import { useList, useRead, useTranslation } from "@reactionable/core";
import { FormField, IUseCrudConfigResult } from "<%= it.uiPackage %>";
import React from "react";
import { string } from "yup";

export type I<%= it.entityName %>Data = {
  id: string;
  label: string;
};

export type I<%= it.entityName %>Values = Omit<I<%= it.entityName %>Data, "id">;

const FormChildren = () => {
  const { t } = useTranslation("<%= it.decapitalize(it.entitiesName) %>");

  return (
    <>
      <FormField name="label" label={t("Label")} placeholder={t("Label")} autoFocus={true} required/>
    </>
  );
};

export const use<%= it.entitiesName %>Config = (): IUseCrudConfigResult<
  I<%= it.entityName %>Values,
  I<%= it.entityName %>Data
> => {
  const { t } = useTranslation("<%= it.decapitalize(it.entitiesName) %>");

  return {
    onCreate: async (data: I<%= it.entityName %>Values) => null,
    onUpdate: async (data: I<%= it.entityName %>Values) => null,
    onDelete: async (id: I<%= it.entityName %>Data["id"]) => null,
    useRead: (variables) =>
      useRead<I<%= it.entityName %>Data>({
        handleQuery: async () => null,
        variables,
      }),
    useList: (variables) =>
      useList<I<%= it.entityName %>Data>({
        handleQuery: async () => null,
        variables,
      }),
    initialValues: {
      label: "",
    },
    validationSchema: {
      label: string()
        .min(1, t("<%= it.capitalize(it.decamelize(it.entityName)) %> label must be at least 1 characters"))
        .required(t("<%= it.capitalize(it.decamelize(it.entityName)) %> label is required")),
    },
    formChildren: FormChildren,
  };
};
`;
