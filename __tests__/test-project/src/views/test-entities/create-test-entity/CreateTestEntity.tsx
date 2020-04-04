import { Create, IFormProps, IOnSubmitForm } from '@reactionable/ui-bootstrap';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { ITestEntityData, ITestEntityValues, testEntityFormChildren, testEntityFormSchema, testEntityFormValues } from '../TestEntitiesConfig';

interface IProps extends Pick<IFormProps<ITestEntityValues, ITestEntityData>, 'onSuccess'> { }
const CreateTestEntity: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const onSubmit: IOnSubmitForm<ITestEntityValues, ITestEntityData> = async (values, formikHelpers) => {
    return { id: '', label: '' };
  };

  const form = {
    title: t('Create a new test entity'),
    onSubmit,
    formValues: testEntityFormValues,
    formSchema: testEntityFormSchema(t),
    chilren: testEntityFormChildren(t),
    ...props,
  };

  return <>
    
    <Create<ITestEntityValues, ITestEntityData> form={form} />
  </>;
};
export default CreateTestEntity;