import React, { Component } from 'react'
import axios from 'axios'
import { Button, TextInput, FormLabel } from '@untappd/components'

const API = 'http://localhost:5000'

class AddTeamForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      mascot: '',
      coach: '',
      wins: 0,
      losses: 0,
    }
  }

  // POST team to database
  postTeam = async () => {
    const { name, mascot, coach, wins, losses } = this.state
    const { teams, updateAppState } = this.props
    const postApiRoute = `${API}/conferences/1/teams`

    // Check for empty inputs
    if (!name || !mascot || !coach) {
      return
    }

    // POST new team
    const newTeam = {
      name,
      mascot,
      coach,
      wins,
      losses,
      conference_id: 1,
    }
    const response = await axios.post(postApiRoute, newTeam)

    // Update app state immutably w/ team data from POST response
    updateAppState({
      addTeam: false,
      teams: teams.concat([response.data]),
    })
  }

  render() {
    const { name, mascot, coach, wins, losses } = this.state
    const { updateAppState } = this.props

    return (
      <form style={{ padding: '50px' }}>
        <FormLabel htmlFor="team-name-input">Team Name</FormLabel>
        <TextInput
          mb={2}
          className="team-name-input"
          type="text"
          defaultValue={name}
          onChange={e => this.setState({ name: e.target.value })}
          autoFocus
        />
        <FormLabel htmlFor="team-mascot-input">Mascot</FormLabel>
        <TextInput
          mb={2}
          className="team-mascot-input"
          type="text"
          defaultValue={mascot}
          onChange={e => this.setState({ mascot: e.target.value })}
        />
        <FormLabel htmlFor="team-coach-input">Coach</FormLabel>
        <TextInput
          mb={2}
          className="team-coach-input"
          type="text"
          defaultValue={coach}
          onChange={e => this.setState({ coach: e.target.value })}
        />
        <FormLabel htmlFor="team-wins-input">Wins</FormLabel>
        <TextInput
          mb={2}
          className="team-wins-input"
          type="number"
          defaultValue={wins}
          onChange={e => this.setState({ wins: e.target.value })}
          min="0"
        />
        <FormLabel htmlFor="team-losses-input">Losses</FormLabel>
        <TextInput
          mb={2}
          className="team-losses-input"
          type="number"
          defaultValue={losses}
          onChange={e => this.setState({ losses: e.target.value })}
          min="0"
        />
        <Button mr={2} color="blue" onClick={this.postTeam}>
          Submit
        </Button>
        <Button color="red" onClick={() => updateAppState({ addTeam: false })}>
          Cancel
        </Button>
      </form>
    )
  }
}

export default AddTeamForm
