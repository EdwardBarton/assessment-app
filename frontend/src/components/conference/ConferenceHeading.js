import React from 'react'
import { Button, Heading } from '@untappd/components'

const ConferenceHeading = ({ conference, updateAppState }) => {
  return (
    <Heading mb={5}>
      {conference.short_name} ({conference.name})
      <Button
        ml={5}
        color="blue"
        onClick={() => updateAppState({ addTeam: true })}
      >
        Add Team
      </Button>
    </Heading>
  )
}

export default ConferenceHeading
