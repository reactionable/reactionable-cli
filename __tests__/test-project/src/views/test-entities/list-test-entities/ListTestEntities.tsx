import { useQueryList } from '@reactionable/amplify';
import { List } from '@reactionable/ui-bootstrap';
import React, { lazy } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link, generatePath, useRouteMatch } from 'react-router-dom';
import { IListTestEntityQueryVariables, ITestEntityData } from '../TestEntitiesConfig';

const CreateTestEntity = lazy(() => import('../create-test-entity/CreateTestEntity'));
const DeleteTestEntity = lazy(() => import('../delete-test-entity/DeleteTestEntity'));
interface IProps { }
const ListTestEntities: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const match = useRouteMatch();
  if (!match) {
    return null;
  }

  const { isLoading, error, data, refetch, next, previous } = useQueryList<ITestEntityData, IListTestEntityQueryVariables>({
  });

  const renderChildren = (data: ITestEntityData) => <tr key={'TestEntity-' + data.id}>
    <td>
      <Link
        to={generatePath(`${match.path}/:testEntitiesId`, { ...match.params, testEntitiesId: data.id })}
        title={t('Go to test entity "{{label}}"', data)}
      >{data.label}</Link>
    </td>
    <td>
      <Link
        to={generatePath(`${match.path}/:testEntitiesId`, { ...match.params, testEntitiesId: data.id })}
        title={t('Go to test entity "{{label}}"', data)}
      >{t('Go to test entity "{{label}}"', data)}</Link>
      <DeleteTestEntity id={data.id} onSuccess={refetch}>
        {t('Delete test entity "{{label}}"', data)}
      </DeleteTestEntity>
    </td>
  </tr>;

  return <>
    <Helmet>
      <title>{t('tests')} - {t('List test entities')}</title>
      <meta name="description" content={t('List test entities description')} />
    </Helmet>
    <h1>{t('List test entities')}</h1>
    <Link disabled={!previous} title={t('Load the previous test entities')}>{t('Previous')}</Link>
    <Link disabled={!next} title={t('Load the next test entities')}>{t('Next')}</Link>
    <List<ITestEntityData>
      error={error}
      data={data}
      isLoading={isLoading}
      head={[t('Label'), t('Actions')]}
      children={renderChildren}
      noData={<>
        <br /> <br />
        {t('You don\'t have any test entities yet')}
        <br />
        {t('Click the button to create a new test entity')}
        <br /><br />
        <CreateTestEntity onSuccess={refetch}>
          <Link>{t('Create a new test entity')}</Link>
        </CreateTestEntity>
      </>}
    />
  </>;
};
export default ListTestEntities;