import React, { Component } from 'react'
import axios from 'axios'
import {
  Box,
  Button,
  Card,
  Heading,
  TextInput,
  ListItem,
  Flex,
  FormLabel,
} from '@untappd/components'

const API = 'http://localhost:5000'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      conference: null,
      teams: [],
    }
  }

  fetchData() {
    axios.get(API, { mode: 'no-cors' }).then(response => {
      const data = response.data
      this.setState({ conference: data.conference, teams: data.teams })
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  // Update database upon clicking "Update" button
  async handleClick(teamID) {
    const putApiRoute = `${API}/conferences/1/teams/${teamID}`
    const teamToUpdate = this.state.teams.filter(t => t.id === teamID)[0]

    // Update database
    const response = await axios.put(putApiRoute, {
      wins: teamToUpdate.wins,
      losses: teamToUpdate.losses,
    })

    // Copy app state w/o mutating original
    const stateCopy = Object.assign({}, this.state)
    stateCopy.teams = stateCopy.teams.slice()
    stateCopy.teams[teamID - 1] = Object.assign({}, stateCopy.teams[teamID - 1])

    // Update app state w/ response data from successful PUT request
    stateCopy.teams[teamID - 1] = response.data
    this.setState(stateCopy)
  }

  // Update app state as Win/Loss input values change
  handleChange(e, teamID) {
    // Store new winning/losing value
    const newValue = Number(e.target.value)

    // Ensure new win/loss value is a number >= 0
    if (newValue >= 0) {
      // Copy app state w/o mutating original
      const stateCopy = Object.assign({}, this.state)
      stateCopy.teams = stateCopy.teams.slice()
      stateCopy.teams[teamID - 1] = Object.assign(
        {},
        stateCopy.teams[teamID - 1],
      )

      // Update team's wins or losses
      if (e.target.classList.contains('win-input')) {
        stateCopy.teams[teamID - 1].wins = newValue
      } else {
        stateCopy.teams[teamID - 1].losses = newValue
      }

      // Update app state
      this.setState(stateCopy)
    } else {
      return
    }
  }

  render() {
    const { conference } = this.state
    const { teams } = this.state

    if (conference === null) {
      return <h3>loading</h3>
    }

    return (
      <Box className="App" mx={12} my={5}>
        <Heading>
          {conference.short_name} ({conference.name})
        </Heading>

        {teams.map(team => (
          <Card key={team.id} mb={3}>
            <Card.Header>
              <Heading p={3}>
                {team.name} {team.mascot}: {team.coach}
                <Box p={3}>
                  <FormLabel htmlFor="win-input">Wins</FormLabel>
                  <TextInput
                    defaultValue={team.wins}
                    mb={2}
                    min="0"
                    className="win-input"
                    type="number"
                    onChange={e => this.handleChange(e, team.id)}
                  />
                  <FormLabel htmlFor="loss-input">Losses</FormLabel>
                  <TextInput
                    defaultValue={team.losses}
                    mb={2}
                    min="0"
                    id="loss-input"
                    type="number"
                    onChange={e => this.handleChange(e, team.id)}
                  />
                  <Button
                    size="small"
                    color="blue"
                    onClick={() => this.handleClick(team.id)}
                  >
                    Update
                  </Button>
                </Box>
              </Heading>
            </Card.Header>
            <Card.Content>
              <ListItem>Player's</ListItem>
              <ListItem>Go</ListItem>
              <ListItem>Here</ListItem>
            </Card.Content>
          </Card>
        ))}
      </Box>
    )
  }
}

export default App
