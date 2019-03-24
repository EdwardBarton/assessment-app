require 'rails_helper'

RSpec.describe TeamsController do
  describe 'GET /teams' do
    let(:conference) { create(:conference) }

    it 'returns a success response with teams' do
      3.times { create(:team, :with_players, conference: conference) }
      get "/conferences/#{conference.id}/teams", as: :json

      expect(response).to have_http_status(:ok)
      expect(response.parsed_body.size).to eq(3)
    end
  end

  # *************************** TODO: LEARN RSPEC!!! *************************** #

  # describe "GET #show" do
  #   it "returns http success with a single team" do
  #     get :show # Results in ActionController error
  #     expect(response).to have_http_status(:ok)
  #     expect(response.parsed_body.size).to eq(1)
  #   end
  # end
  
  # describe "POST #create" do
  #   it "creates a new team" do
  #     expect {
  #       post :create {conference_id: conference.id, team: valid_team_attributes, format: :json}
  #     }.to change(Team, :count).by(1)
  #   end

  #   it "assigns a newly created team as @team" do
  #     post :create, { conference_id: conference.id, team: valid_team_attributes, format: :json  }

  #     expect(assigns(:team)).to be_a_new(Team)
  #     expect(assigns(:team)).to be_persisted
  #   end

  #   it "assigns a newly created but unsaved team as @team" do
  #     post :create, { conference_id: conference.id, team: invalid_team_attributes, format: :json  }

  #     expect(assigns(:team)).to be_a_new(Team)
  #   end

  #   it "returns unprocessable_entity status" do
  #     put :create, { conference_id: conference.id, team: invalid_team_attributes, format: :json }

  #     expect(response.status).to eq(422)
  #   end
  # end
end