import React from 'react'
import { Card } from '@untappd/components'
import TeamCardHeader from './TeamCardHeader'
import TeamCardBody from './TeamCardBody'

const TeamCard = ({ team, teams, updateAppState }) => (
  <Card mb={3}>
    <TeamCardHeader team={team} teams={teams} updateAppState={updateAppState} />
    {team.showPlayers ? (
      <TeamCardBody team={team} teams={teams} updateAppState={updateAppState} />
    ) : null}
  </Card>
)

export default TeamCard
