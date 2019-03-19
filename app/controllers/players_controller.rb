class PlayersController < ApplicationController
  before_action :set_team

  # GET /players
  def index
    @players = @team.players

    render json: @players
  end

  # GET /players/:id
  def show
    @player = Player.find(params[:id])

    render json: @player
  end

  # PUT /players/:id
  def update
    @player = Player.find(params[:id])
    @player.update(player_params)

    render json: @player
  end

  private

  # Filter players by team
  def set_team
    @team = Team.find(params[:team_id])
  end

  # Only allow the updating of a player's jersey number
  def player_params
    params.require(:player).permit(:jersey_number)
  end
end
