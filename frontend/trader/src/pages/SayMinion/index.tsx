import { ReactElement } from 'react'
import { Route } from 'react-router-dom'

import { RoutePath } from 'types'

import Main from './Main'

const SayMinion = (): ReactElement => {
  return <Route exact path={RoutePath.say_minion} component={Main} />
}

export default SayMinion
