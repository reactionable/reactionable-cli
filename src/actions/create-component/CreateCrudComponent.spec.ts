import CreateCrudComponent from './CreateCrudComponent';
import container from '../../container';

jest.mock('fs');

test('getTemplateFileContent', async () => {
    const createCrudComponent = container.get(CreateCrudComponent);
    await createCrudComponent.run({ realpath: '__tests__/test-project', name: 'test entity' });
});