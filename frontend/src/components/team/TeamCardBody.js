import React from 'react'
import PlayerDetail from '../player/PlayerDetail'
import { Card, List, Flex } from '@untappd/components'

const TeamCardBody = ({ team, teams, updateAppState }) => (
  <Card.Content>
    <List>
      <Flex className="players" justifyContent="space-around">
        {team.players.length ? (
          team.players.map(p => (
            <PlayerDetail
              player={p}
              key={p.id}
              teams={teams}
              updateAppState={updateAppState}
            />
          ))
        ) : (
          <p>No players found</p>
        )}
      </Flex>
    </List>
  </Card.Content>
)

export default TeamCardBody
