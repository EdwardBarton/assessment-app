import React from 'react'
import { Box, ListItem } from '@untappd/components'
import EditPlayerJersey from './EditPlayerJersey'
import StartingPlayer from './StartingPlayer'

const PlayerDetail = ({ player, teams, updateAppState }) => {
  // Shows edit jersey input for a given player
  const editJersey = () => {
    const teamsCopy = [...teams]

    teamsCopy[player.team_id - 1].players.find(
      p => p.id === player.id,
    ).editJersey = true

    updateAppState({ teams: teamsCopy })
  }

  // Render
  return (
    <ListItem style={{ border: 'none' }}>
      <ListItem.Content>
        <ListItem.Heading style={{ textAlign: 'center' }}>
          {player.name}
        </ListItem.Heading>
        <Box>
          <StartingPlayer
            player={player}
            teams={teams}
            updateAppState={updateAppState}
          />

          {player.editJersey ? (
            <EditPlayerJersey
              player={player}
              teams={teams}
              updateAppState={updateAppState}
            />
          ) : (
            <ListItem.Info>
              Jersey #: {` ${player.jersey_number} `}
              <i
                className="fas fa-edit"
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={editJersey}
              />
            </ListItem.Info>
          )}

          <ListItem.Info>Height: {player.height}</ListItem.Info>
          <ListItem.Info>Weight: {player.weight}</ListItem.Info>
          <ListItem.Info>Position: {player.position}</ListItem.Info>
        </Box>
      </ListItem.Content>
    </ListItem>
  )
}

export default PlayerDetail
