import React from 'react'
import ReactDOM from 'react-dom'
import './styles/app.scss'
import { DefaultTheme } from '@untappd/components'
import App from './components/App'

ReactDOM.render(
  <DefaultTheme>
    <App />
  </DefaultTheme>,
  document.getElementById('root'),
)
