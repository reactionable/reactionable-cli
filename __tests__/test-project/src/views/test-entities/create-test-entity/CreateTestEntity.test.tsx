import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import CreateTestEntity from './CreateTestEntity';

it('renders without crashing', () => {  
    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><CreateTestEntity /></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
});