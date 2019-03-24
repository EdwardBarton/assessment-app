import React, { Component } from 'react'
import axios from 'axios'
import { TextInput, ListItem, FormLabel } from '@untappd/components'

const API = 'http://localhost:5000'

class EditPlayerJersey extends Component {
  constructor(props) {
    super(props)

    this.state = {
      jerseyNumber: props.player.jersey_number,
    }
  }

  // Update a player's jersey number in-line
  updateJerseyNumber = async () => {
    const { player, teams, updateAppState } = this.props
    const { jerseyNumber } = this.state

    const putApiRoute = `${API}/conferences/1/teams/${player.team_id}/players/${
      player.id
    }`

    // Ensure new jersey number >= 0
    if (jerseyNumber >= 0) {
      const response = await axios.put(putApiRoute, {
        jersey_number: jerseyNumber,
      })

      // Update team player app state immutably w/ response from successful PUT request
      const teamsCopy = [...teams]

      // Update team players
      teamsCopy[player.team_id - 1].players.map((p, index, arr) => {
        if (p.id === player.id) {
          // Overwrite player w/ player from server response
          arr[index] = response.data
        }
        return arr
      })

      // Keep edit jersey input open until "Enter"
      teamsCopy[player.team_id - 1].players.find(
        p => p.id === player.id,
      ).editJersey = true

      updateAppState({ teams: teamsCopy })
    } else {
      return
    }
  }

  // Close edit jersey input for a given player on "Enter" or "Escape"
  closeEditJersey = e => {
    const { player, teams, updateAppState } = this.props

    if (e.key === 'Enter' || e.key === 'Escape') {
      const teamsCopy = [...teams]
      teamsCopy[player.team_id - 1].players.find(
        p => p.id === player.id,
      ).editJersey = false

      updateAppState({ teams: teamsCopy })
    } else {
      return
    }
  }

  render() {
    return (
      <ListItem.Info>
        <FormLabel htmlFor="jersey-input">Jersey #</FormLabel>
        <TextInput
          defaultValue={this.state.jerseyNumber}
          min="0"
          className="jersey-input"
          type="number"
          onChange={e =>
            this.setState(
              { jerseyNumber: e.target.value },
              this.updateJerseyNumber,
            )
          }
          onKeyUp={e => this.closeEditJersey(e)}
          autoFocus
        />
      </ListItem.Info>
    )
  }
}

export default EditPlayerJersey
