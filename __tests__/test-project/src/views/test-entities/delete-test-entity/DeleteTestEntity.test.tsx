import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import DeleteTestEntity from './DeleteTestEntity';

it('renders without crashing', () => {  
    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><DeleteTestEntity /></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
});