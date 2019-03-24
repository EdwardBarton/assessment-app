class TeamsController < ApplicationController
  # GET /teams
  def index
    @teams = Team.all

    render json: @teams
  end

  # GET /teams/:id
  def show
    @team = Team.find(params[:id])

    render json: @team
  end

  # PUT /teams/:id
  def update
    @team = Team.find(params[:id])
    @team.update(team_params)

    render json: @team
  end

  # POST /teams
  def create
    @team = Team.new(team_params)

    respond_to do |format|
      if @team.save
        # React App
        format.html {
          render json: @team,
          status: :created
        } 
        # Postman (Not DRY)
        format.json  {
          render json: @team,
          status: :created
        } 
      else
        # React App
        format.html {
          render json: @team.errors,
          status: :unprocessable_entity
        } 
        # Postman (Not DRY)
        format.json  {
          render json: @team.errors,
          status: :unprocessable_entity
        } 
      end
    end
  end

  private
  
  def team_params
    params.require(:team).permit(:name, :mascot, :coach, :wins, :losses, :conference_id)
  end
end 
