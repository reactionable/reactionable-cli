import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router';
import ReadTestEntity from './ReadTestEntity';

it('renders without crashing', () => {  
    const div = document.createElement('div');
    ReactDOM.render(<MemoryRouter><ReadTestEntity /></MemoryRouter>, div);
    ReactDOM.unmountComponentAtNode(div);
});