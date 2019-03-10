import a from './print.js'
import './css/index.css'
import React from 'react';
import ReactDOM from 'react-dom';


class Test extends React.Component {
    render() {
        return (
            <h1>ssss</h1>
        )
    }
}


ReactDOM.render(
    <Test />,
    document.querySelector('#root')
)