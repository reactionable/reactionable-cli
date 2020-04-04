import { IFormProps, IOnSubmitForm, Update } from '@reactionable/ui-bootstrap';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ITestEntityData, ITestEntityValues, testEntityFormChildren, testEntityFormSchema, testEntityFormValues } from '../TestEntitiesConfig';

interface IProps extends Pick<IUpdateProps<ITestEntityValues, ITestEntityData>, 'onSuccess' | 'formValues'> { }
const UpdateTestEntity: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const matchParams = useParams<{ testEntityId: string }>();
  const onSubmit: IOnSubmitForm<ITestEntityValues, ITestEntityData> = async (values, formikHelpers) => {
    return { id: '', label: '' };
  };

  const safeFormValues: any = { ...testEntityFormValues };
  Object.keys(safeFormValues).forEach(value => {
    const key = value as keyof ITestEntityValues;
    if (props.formValues[key]) {
      safeFormValues[key] = props.formValues[key] as ITestEntityValues[keyof ITestEntityValues];
    }
  });

  const form = {
    title: t('Update test entity "{{label}}"', safeFormValues),
    onSubmit,
    formValues: safeFormValues,
    formSchema: testEntityFormSchema(t),
    chilren: testEntityFormChildren(t),
    ...props,
  };

  return <>
    
    <Update<ITestEntityValues, ITestEntityData> form={form} />
  </>;
};
export default UpdateTestEntity;