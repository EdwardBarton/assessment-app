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

  // Fetch team players and toggle visibility when "Players" button is clicked in Card.Header
  async fetchTeamPlayers(team) {
    const { teams } = this.state

    // Only fetch players on initial click
    if (!team.players) {
      const getPlayersApiRoute = `${API}/conferences/1/teams/${team.id}/players`
      const response = await axios.get(getPlayersApiRoute, { mode: 'no-cors' })

      // Update team with players response
      const updatedTeam = {
        ...teams[team.id - 1],
        players: response.data,
        showPlayers: true,
      }

      // Update app state teams array w/ updated team
      const teamsCopy = [...teams]
      teamsCopy[team.id - 1] = updatedTeam
      this.setState({ teams: teamsCopy })
    } else {
      // Copy team from app state immutably and toggle players visibility
      const teamToUpdate = { ...teams[team.id - 1] }
      teamToUpdate.showPlayers = !teamToUpdate.showPlayers

      // Update app state teams array w/ updated team immutably
      const teamsCopy = [...teams]
      teamsCopy[team.id - 1] = teamToUpdate
      this.setState({ teams: teamsCopy })
    }
  }

  // Update database upon clicking "Update W/L" button
  async updateTeamWinsLosses(teamID) {
    const { teams } = this.state
    const putApiRoute = `${API}/conferences/1/teams/${teamID}`
    const teamToUpdate = { ...teams[teamID - 1] }

    // Update database
    const response = await axios.put(putApiRoute, {
      wins: teamToUpdate.wins,
      losses: teamToUpdate.losses,
    })

    // Copy teams from app state immutably and update w/ response data from successful PUT request
    const teamsCopy = [...teams]
    teamsCopy[teamID - 1] = response.data
    this.setState({ teams: teamsCopy })
  }

  // Update app state as Win/Loss input values change
  handleChange(e, teamID) {
    const { teams } = this.state

    // Store new winning/losing value
    const newWinLoss = Number(e.target.value)

    // Ensure new win/loss value is a number >= 0
    if (newWinLoss >= 0) {
      // Copy teams app state immutably and update team's wins/losses
      const teamsCopy = [...teams]

      if (e.target.classList.contains('win-input')) {
        teamsCopy[teamID - 1].wins = newWinLoss
      } else {
        teamsCopy[teamID - 1].losses = newWinLoss
      }

      // Update app state
      this.setState({ teams: teamsCopy })
    } else {
      return
    }
  }

  // Update a player's jersey number in-line
  async updateJerseyNumber(e, player) {
    const { teams } = this.state
    const newJerseyNumber = Number(e.target.value)
    const putApiRoute = `${API}/conferences/1/teams/${player.team_id}/players/${
      player.id
    }`

    // Ensure new jersey number >= 0
    if (newJerseyNumber >= 0) {
      const response = await axios.put(putApiRoute, {
        jersey_number: newJerseyNumber,
      })

      // Update team player app state immutably w/ response from successful PUT request
      const teamsCopy = [...teams]
      teamsCopy[player.team_id - 1].players[player.id - 1] = response.data
      this.setState({ teams: teamsCopy })
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
                <Button
                  mx={2}
                  size="small"
                  color="blue"
                  onClick={() => this.fetchTeamPlayers(team)}
                >
                  {team.showPlayers ? 'Hide' : 'Show'} Players
                </Button>
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
                    onClick={() => this.updateTeamWinsLosses(team.id)}
                  >
                    Update W/L
                  </Button>
                </Box>
              </Heading>
            </Card.Header>
            {team.showPlayers ? (
              <Card.Content>
                <Flex className="players" justifyContent="space-around">
                  {team.players.map(p => (
                    <ListItem key={p.id}>
                      <ListItem.Content>
                        <ListItem.Heading style={{ textAlign: 'center' }}>
                          {p.name}
                        </ListItem.Heading>
                        <Box>
                          <ListItem.Info>
                            Starter? {p.starter ? 'Yes' : 'No'}
                          </ListItem.Info>
                          <ListItem.Info>
                            Jersey #:{' '}
                            <TextInput
                              defaultValue={p.jersey_number}
                              min="0"
                              className="loss-input"
                              type="number"
                              onChange={e => this.updateJerseyNumber(e, p)}
                            />
                          </ListItem.Info>
                          <ListItem.Info>Height: {p.height}</ListItem.Info>
                          <ListItem.Info>Weight: {p.weight}</ListItem.Info>
                          <ListItem.Info>Position: {p.position}</ListItem.Info>
                        </Box>
                      </ListItem.Content>
                    </ListItem>
                  ))}
                </Flex>
              </Card.Content>
            ) : null}
          </Card>
        ))}
      </Box>
    )
  }
}

export default App
