import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import UpdateTestEntity from './UpdateTestEntity';

it('renders without crashing', () => {  
    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><UpdateTestEntity /></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
});