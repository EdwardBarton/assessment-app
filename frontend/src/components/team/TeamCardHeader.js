import React from 'react'
import axios from 'axios'
import EditRecordForm from './EditRecordForm'
import { Button, Card, Heading } from '@untappd/components'

const API = 'http://localhost:5000'

const TeamCardHeader = ({ team, teams, updateAppState }) => {
  // Fetch team players and toggle visibility when "Players" button is clicked in Card.Header
  const fetchTeamPlayers = async team => {
    // Only fetch players on initial click
    if (!team.players) {
      const getPlayersApiRoute = `${API}/conferences/1/teams/${team.id}/players`
      const response = await axios.get(getPlayersApiRoute, { mode: 'no-cors' })
      const playersData = response.data

      // Update team with players response
      const updatedTeam = {
        ...teams[team.id - 1],
        players: playersData.map(p => {
          p.editJersey = false
          return p
        }),
        showPlayers: true,
      }

      // Update app state teams array w/ updated team immutably
      const teamsCopy = [...teams]
      teamsCopy[team.id - 1] = updatedTeam
      updateAppState({ teams: teamsCopy })
    } else {
      // Copy team from app state immutably and toggle players visibility
      const teamToUpdate = { ...teams[team.id - 1] }
      teamToUpdate.showPlayers = !teamToUpdate.showPlayers

      // Update app state teams array w/ updated team immutably
      const teamsCopy = [...teams]
      teamsCopy[team.id - 1] = teamToUpdate
      updateAppState({ teams: teamsCopy })
    }
  }

  // Shows edit record form for a given team
  const toggleEditRecord = (e, teamID) => {
    const teamsCopy = [...teams]
    teamsCopy[teamID - 1].editRecord = e.target.classList.contains(
      'edit-record-btn',
    )
      ? true
      : false
    updateAppState({ teams: teamsCopy })
  }

  // Render
  return (
    <Card.Header>
      <Heading p={3}>
        {team.name} {team.mascot}: {team.coach}
        <Button
          ml={3}
          size="small"
          color="blue"
          onClick={() => fetchTeamPlayers(team)}
        >
          {team.showPlayers ? 'Hide' : 'Show'} Players
        </Button>
        {team.editRecord ? (
          <EditRecordForm
            team={team}
            teams={teams}
            updateAppState={updateAppState}
            toggleEditRecord={toggleEditRecord}
          />
        ) : (
          <p>
            Record (W-L): {team.wins} - {team.losses}{' '}
            <i
              className="fas fa-edit edit-record-btn"
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={e => toggleEditRecord(e, team.id)}
            />
          </p>
        )}
      </Heading>
    </Card.Header>
  )
}

export default TeamCardHeader
