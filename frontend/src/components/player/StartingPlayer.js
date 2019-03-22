import React, { Component } from 'react'
import axios from 'axios'
import { ListItem } from '@untappd/components'

const API = 'http://localhost:5000'

class StartingPlayer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      starter: props.player.starter,
    }
  }

  // Update a player's starting status in-line
  updateStartingPlayer = async () => {
    const { player, teams, updateAppState } = this.props

    const putApiRoute = `${API}/conferences/1/teams/${player.team_id}/players/${
      player.id
    }`
    const response = await axios.put(putApiRoute, {
      starter: this.state.starter,
    })

    // Copy state teams immutably
    const teamsCopy = [...teams]

    // Update team players
    teamsCopy[player.team_id - 1].players.map((p, index, arr) => {
      if (p.id === player.id) {
        // Overwrite player w/ player from server response
        arr[index] = response.data
      }
      return arr
    })

    updateAppState({ teams: teamsCopy })
  }

  // Render
  render() {
    return (
      <ListItem.Info>
        Starter:{' '}
        <input
          type="checkbox"
          defaultChecked={this.state.starter}
          onChange={e =>
            this.setState(
              { starter: e.target.checked },
              this.updateStartingPlayer,
            )
          }
        />
      </ListItem.Info>
    )
  }
}

export default StartingPlayer
