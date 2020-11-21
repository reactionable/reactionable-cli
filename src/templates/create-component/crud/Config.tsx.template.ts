export default `import { useList, useRead, useTranslation } from "@reactionable/core";
import { FormField, IUseCrudConfigResult } from "{{ uiPackage }}";
import React from "react";
import { string } from "yup";

export type I{{ entityName }}Data = {
  id: string;
  label: string;
};

export type I{{ entityName }}Values = Omit<I{{ entityName }}Data, "id">;

const FormChildren = () => {
  const { t } = useTranslation("{{ entitiesName }}");

  return (
    <>
      <FormField name="label" label={t("Label")} placeholder={t("Label")} autoFocus={true} />
    </>
  );
};

export const use{{ entitiesName }}Config = (): IUseCrudConfigResult<
  I{{ entityName }}Values,
  I{{ entityName }}Data
> => {
  const { t } = useTranslation("{{ entitiesName }}");

  return {
    onCreate: async (data: I{{ entityName }}Values) => null,
    onUpdate: async (data: I{{ entityName }}Values) => null,
    onDelete: async (id: I{{ entityName }}Data["id"]) => null,
    useRead: (variables) =>
      useRead<I{{ entityName }}Data>({
        handleQuery: async () => null,
        variables,
      }),
    useList: (variables) =>
      useList<I{{ entityName }}Data>({
        handleQuery: async () => null,
        variables,
      }),
    initialValues: {
      label: "",
    },
    validationSchema: {
      label: string()
        .min(1, t("{{capitalize (decamelize entityName) }} label must be at least 1 characters"))
        .required(t("{{capitalize (decamelize entityName) }} label is required")),
    },
    formChildren: FormChildren,
  };
};
`;
