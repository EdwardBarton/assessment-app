import React, { Component } from 'react'
import axios from 'axios'
import { Box, Button, TextInput, FormLabel } from '@untappd/components'

const API = 'http://localhost:5000'

class EditRecordForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wins: props.team.wins,
      losses: props.team.losses,
    }
  }

  // Update database upon clicking "Update" button
  updateTeamWinsLosses = async () => {
    const { team, teams, updateAppState } = this.props
    const { wins, losses } = this.state
    const putApiRoute = `${API}/conferences/1/teams/${team.id}`

    // Update database
    const response = await axios.put(putApiRoute, {
      wins,
      losses,
    })

    // Copy teams from app state immutably and update w/ response data from successful PUT request
    const teamsCopy = [...teams]
    teamsCopy[team.id - 1] = response.data

    // Maintain app state that team response doesn't return
    teamsCopy[team.id - 1].players = teams[team.id - 1].players
    teamsCopy[team.id - 1].showPlayers = teams[team.id - 1].showPlayers

    // Hide edit record form and update state
    teamsCopy[team.id - 1].editRecord = false
    updateAppState({ teams: teamsCopy })
  }

  // Render
  render() {
    const { team, toggleEditRecord } = this.props
    const { wins, losses } = this.state

    return (
      <Box p={3}>
        <FormLabel htmlFor="win-input">Wins</FormLabel>
        <TextInput
          defaultValue={wins}
          mb={2}
          min="0"
          className="win-input"
          type="number"
          onChange={e => this.setState({ wins: e.target.value })}
          autoFocus
        />
        <FormLabel htmlFor="loss-input">Losses</FormLabel>
        <TextInput
          defaultValue={losses}
          mb={2}
          min="0"
          id="loss-input"
          type="number"
          onChange={e => this.setState({ losses: e.target.value })}
        />
        <Button
          size="small"
          mr={2}
          color="blue"
          onClick={this.updateTeamWinsLosses}
        >
          Update
        </Button>
        <Button
          size="small"
          color="red"
          className="cancel-record-update-btn"
          onClick={e => toggleEditRecord(e, team.id)}
        >
          Cancel
        </Button>
      </Box>
    )
  }
}

export default EditRecordForm
