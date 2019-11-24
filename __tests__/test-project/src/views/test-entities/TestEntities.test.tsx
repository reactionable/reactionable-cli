import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import TestEntities from './TestEntities';

it('renders without crashing', () => {  
    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><TestEntities /></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
});