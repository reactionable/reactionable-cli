import { Read } from '@reactionable/ui-bootstrap';
import React, { lazy } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ITestEntityData } from '../TestEntitiesConfig';

const UpdateTestEntity = lazy(() => import('../update-test-entity/UpdateTestEntity'));
interface IProps { }
const ReadTestEntity: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const matchParams = useParams<{ testEntityId: string }>();
  
  const renderChildren = (data: ITestEntityData) => <>
    <Helmet>
      <title>{t('tests')} - {t('Read test entity - {{label}}', data)}</title>
      <meta name="description" content={t('Read test entity - {{label}}', data)} />
    </Helmet>
    <h1>{t('Read test entity - {{label}}', data)}</h1>
    { data && <>
      <UpdateTestEntity
        onSuccess={refetch}
        formValues={data}
      >
        <Link to="#">{ t('Update test entity "{{label}}"', data) }</Link>
      </UpdateTestEntity>
    </>}
  </>;

  return <>
    
    <Read<ITestEntityData>
      isLoading={isLoading}
      error={error}
      data={data}
      children={renderChildren}
    />
  </>;
};
export default ReadTestEntity;