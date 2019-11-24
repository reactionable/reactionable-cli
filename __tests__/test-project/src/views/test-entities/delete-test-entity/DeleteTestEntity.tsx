import { Delete, IDeleteProps } from '@reactionable/ui-bootstrap';
import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { ITestEntityData } from '../TestEntitiesConfig';

interface IProps extends Pick<IDeleteProps<ITestEntityData>, 'onSuccess'> {
  id: string; 
  label?: boolean;
}
const DeleteTestEntity: React.FC<IProps> = (props) => {
  const { t } = useTranslation();
  const { id, label, ...deleteProps} = props;
  const onConfirm = async (): Promise<ITestEntityData> => {
    return { id, label: '' };
  };

  return <>
    
    <Delete<ITestEntityData>
      {...deleteProps}
      title={t('Delete test entity')}
      children={label ? t('Delete test entity') : undefined}
      confirmationMessage={t('Are you sure you want to delete this test entity ?')}
      successMessage={t('The test entity has been deleted')}
      onConfirm={onConfirm}
    />
  </>;
};
export default DeleteTestEntity;