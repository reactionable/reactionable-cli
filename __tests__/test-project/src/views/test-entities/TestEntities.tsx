import { Crud } from '@reactionable/core';
import { IUseLayoutProps } from '@reactionable/ui-bootstrap';
import React, { lazy } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { ITestEntityData } from './TestEntitiesConfig';

const ListTestEntities = lazy(() => import('./list-test-entities/ListTestEntities'));
const ReadTestEntity = lazy(() => import('./read-test-entity/ReadTestEntity'));
interface IProps { }
const TestEntities: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  
  return <>
    
    <Crud<ITestEntityData, IUseLayoutProps>
      name="TestEntity"
      listComponent={ ListTestEntities }
      readComponent={ ReadTestEntity }
      {...props}
    />
  </>;
};
export default TestEntities;