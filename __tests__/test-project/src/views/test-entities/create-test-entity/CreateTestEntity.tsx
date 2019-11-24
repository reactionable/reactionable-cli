import { IOnSubmitForm } from '@reactionable/core';
import { Create, ICreateProps } from '@reactionable/ui-bootstrap';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { ITestEntityData, ITestEntityValues, testEntityFormChildren, testEntityFormSchema, testEntityFormValues } from '../TestEntitiesConfig';

interface IProps extends Pick<ICreateProps<ITestEntityValues, ITestEntityData>, 'onSuccess'> { }
const CreateTestEntity: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const onSubmit: IOnSubmitForm<ITestEntityValues, ITestEntityData> = async (values, formikHelpers) => {
    return { id: '', label: '' };
  };

  return <>
    
    <Create<ITestEntityValues, ITestEntityData>
      {...props}
      title={t('Create a new test entity')}
      onSubmit={onSubmit}
      formValues={ testEntityFormValues}
      formSchema={ testEntityFormSchema(t)}
      formChildren={ testEntityFormChildren(t)}
    />
  </>;
};
export default CreateTestEntity;