import { ReactElement } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import HomePage from 'pages/Home'
import LpTowerPage from 'pages/LpTower'
import MinionPaperPage from 'pages/MinionPaper'
import SayMinionPage from 'pages/SayMinion'
import SendMinionPage from 'pages/SendMinion'

import { RoutePath } from 'types'

const SwitchPages = (): ReactElement => {
  return (
    <Switch>
      <Redirect exact from="/" to={RoutePath.home} />
      <Route path={RoutePath.home} component={HomePage} />
      <Route path={RoutePath.lpTower} component={LpTowerPage} />
      <Route path={RoutePath.minion_paper} component={MinionPaperPage} />
      <Route path={RoutePath.say_minion} component={SayMinionPage} />
      <Route path={RoutePath.send} component={SendMinionPage} />
    </Switch>
  )
}
export default SwitchPages
