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

  async fetchData() {
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

  // *************************** UPDATE TEAM FUNCTIONS *************************** //

  // Fetch team players and toggle visibility when "Players" button is clicked in Card.Header
  async fetchTeamPlayers(team) {
    const { teams } = this.state

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

    // Maintain app state that team response doesn't return
    teamsCopy[teamID - 1].players = this.state.teams[teamID - 1].players
    teamsCopy[teamID - 1].showPlayers = this.state.teams[teamID - 1].showPlayers

    // Hide edit record form and update state
    teamsCopy[teamID - 1].editRecord = false
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

  // *************************** PLAYER UPDATE FUNCTIONS *************************** //
  // TODO: Combine update functions to accept a player and which prop is being updated w/ new value

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

      this.setState({ teams: teamsCopy })
    } else {
      return
    }
  }

  // Update a player's starting status in-line
  async updateStartingPlayer(e, player) {
    const { teams } = this.state
    const newStarterValue = e.target.checked
    const putApiRoute = `${API}/conferences/1/teams/${player.team_id}/players/${
      player.id
    }`
    const response = await axios.put(putApiRoute, {
      starter: newStarterValue,
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

    this.setState({ teams: teamsCopy })
  }

  // *************************** TOGGLE TEXT INPUTS *************************** //

  // Shows edit record form for a given team
  editRecord(team) {
    const teamsCopy = [...this.state.teams]
    teamsCopy[team.id - 1].editRecord = true
    this.setState({ teams: teamsCopy })
  }

  // Shows edit jersey input for a given player
  editJersey(player) {
    const teamsCopy = [...this.state.teams]

    teamsCopy[player.team_id - 1].players.find(
      p => p.id === player.id,
    ).editJersey = true

    this.setState({ teams: teamsCopy })
  }

  // Close edit jersey input for a given player on "Enter"
  closeEditJersey(e, player) {
    if (e.key === 'Enter') {
      const teamsCopy = [...this.state.teams]

      teamsCopy[player.team_id - 1].players.find(
        p => p.id === player.id,
      ).editJersey = false

      this.setState({ teams: teamsCopy })
    } else {
      return
    }
  }

  // *************************** RENDER *************************** //

  render() {
    const { conference } = this.state
    const { teams } = this.state

    if (conference === null) {
      return <h3>loading</h3>
    }

    return (
      <Box className="App" mx={12} my={5}>
        <Heading mb={5}>
          {conference.short_name} ({conference.name})
          <Button ml={5} color="blue">
            Add Team
          </Button>
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
                {team.editRecord ? (
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
                      Update
                    </Button>
                  </Box>
                ) : (
                  <p>
                    Record (W-L): {team.wins} - {team.losses}{' '}
                    <i
                      className="fas fa-edit"
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => this.editRecord(team)}
                    />
                  </p>
                )}
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
                            Starter:{' '}
                            <input
                              type="checkbox"
                              defaultChecked={p.starter}
                              onChange={e => {
                                this.updateStartingPlayer(e, p)
                              }}
                            />
                          </ListItem.Info>

                          {p.editJersey ? (
                            <ListItem.Info>
                              <FormLabel htmlFor="jersey-input">
                                Jersey #
                              </FormLabel>
                              <TextInput
                                defaultValue={p.jersey_number}
                                min="0"
                                className="jersey-input"
                                type="number"
                                onChange={e => this.updateJerseyNumber(e, p)}
                                onKeyPress={e => this.closeEditJersey(e, p)}
                              />
                            </ListItem.Info>
                          ) : (
                            <ListItem.Info>
                              Jersey #: {` ${p.jersey_number} `}
                              <i
                                className="fas fa-edit"
                                style={{ color: 'red', cursor: 'pointer' }}
                                onClick={() => this.editJersey(p)}
                              />
                            </ListItem.Info>
                          )}

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
