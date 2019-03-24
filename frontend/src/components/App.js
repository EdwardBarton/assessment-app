import React, { Component } from 'react'
import axios from 'axios'
import ConferenceHeading from './conference/ConferenceHeading'
import TeamCard from './team/TeamCard'
import AddTeamForm from './team/AddTeamForm'
import { Box } from '@untappd/components'

const API = 'http://localhost:5000'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      conference: null,
      teams: [],
      addTeam: false,
    }
  }

  updateAppState = updateObj => this.setState(updateObj)

  fetchData = async () => {
    const response = await axios.get(API, { mode: 'no-cors' })
    const data = response.data
    const updatedTeams = data.teams.map(t => {
      t.editRecord = false
      return t
    })

    this.setState({ conference: data.conference, teams: updatedTeams })
  }

  componentDidMount() {
    this.fetchData()
  }

  // Render
  render() {
    const { conference, teams, addTeam } = this.state

    if (conference === null) {
      return <h3>loading</h3>
    }

    if (addTeam) {
      return (
        <AddTeamForm
          updateAppState={this.updateAppState}
          teams={this.state.teams}
        />
      )
    }

    return (
      <Box className="App" mx={12} my={5}>
        <ConferenceHeading
          conference={this.state.conference}
          updateAppState={this.updateAppState}
        />
        {teams.map(team => (
          <TeamCard
            team={team}
            key={team.id}
            teams={this.state.teams}
            updateAppState={this.updateAppState}
          />
        ))}
      </Box>
    )
  }
}

export default App
