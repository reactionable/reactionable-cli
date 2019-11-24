import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import ListTestEntities from './ListTestEntities';

it('renders without crashing', () => {  
    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><ListTestEntities /></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
});