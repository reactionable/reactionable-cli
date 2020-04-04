
import CreateCrudComponent from './CreateCrudComponent';
import container from '../../container';
import { resolve } from 'path';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';

describe('CreateCrudComponent', () => {
    const testDirPath = '__tests__/test-project';
    beforeEach(async () => {
        const testEntityDirPath = resolve(testDirPath, 'src/views/test-entities');
        const rimraf = promisify(require('rimraf'));
        await rimraf(testEntityDirPath);
    });


    it('run', async () => {
        const createCrudComponent = container.get(CreateCrudComponent);
        await createCrudComponent.run({ realpath: testDirPath, name: 'test entity' });

        const expectedFiles = [       
            'create-test-entity/CreateTestEntity.test.tsx',
            'create-test-entity/CreateTestEntity.tsx',
            'delete-test-entity/DeleteTestEntity.test.tsx',
            'delete-test-entity/DeleteTestEntity.tsx',
            'list-test-entities/ListTestEntities.test.tsx',
            'list-test-entities/ListTestEntities.tsx',
            'read-test-entity/ReadTestEntity.test.tsx',
            'read-test-entity/ReadTestEntity.tsx',
            'update-test-entity/UpdateTestEntity.test.tsx',
            'update-test-entity/UpdateTestEntity.tsx',
            'TestEntities.test.tsx',     
            'TestEntities.tsx', 
            'TestEntitiesConfig.tsx' ,  
        ];

        for(const expectedFile of expectedFiles){
            const filePath = resolve(testDirPath,'src/views/test-entities',expectedFile);
            expect(existsSync(filePath)).toBe(true);
            expect(readFileSync(filePath, 'utf-8')).toMatchSnapshot();
        }
    });
});
