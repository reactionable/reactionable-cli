import { IFormChildrenProps } from '@reactionable/core';
import { FormField } from '@reactionable/ui-bootstrap';
import { TFunction } from 'i18next';
import React from 'react';
import { string } from 'yup';

export type ITestEntityData = {
  id: string;
  label: string;
};
export type ITestEntityValues = Omit<ITestEntityData, 'id'>;
export type IListTestEntityQueryVariables = {

};
export const testEntityFormValues: ITestEntityValues = {
  label: '',
};
export const testEntityFormSchema = (t: TFunction) => ({
   label: string()
    .min(1, t('Test entity label must be at least 1 characters'))
    .required(t('Test entity label is required')),
});
export const testEntityFormChildren = (t: TFunction) => (formikProps: IFormChildrenProps<ITestEntityValues>) => <>
  <FormField
    name="label"
    label={t('Label')}
    autoFocus={true}
  />
</>;