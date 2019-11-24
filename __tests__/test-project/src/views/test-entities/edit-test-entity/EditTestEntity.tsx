import { Edit, IEditProps } from '@reactionable/@reactionable/ui-bootstrap';
import { IOnSubmitForm } from '@reactionable/core';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { ITestEntityData, ITestEntityValues, TestEntityFormSchema } from '../TestEntitiesConfig';
interface IProps extends Pick<IEditProps<ITestEntityValues, ITestEntityData>, 'onSuccess'|'formValues'> {}
const EditTestEntity: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const onSubmit: IOnSubmitForm<ITestEntityValues, ITestEntityData> = async (values, formikHelpers) => {
    return values;
  };

  return <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>{t('tests')} - {t('EditTestEntity')}</title>
      <meta name="description" content={t('EditTestEntity description')} />
    </Helmet>
    <h1>{t('EditTestEntity')}</h1>
    <Edit<ITestEntityValues, ITestEntityData>
          title={t('Edit TestEntity')}
          onSubmit={onSubmit}
          onSuccess={props.onSuccess}
          formSchema={ TestEntityFormSchema}
          formValues={props.formValues}
        />
  </>;
};
export default EditTestEntity;