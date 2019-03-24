class AddStarterToPlayers < ActiveRecord::Migration[5.2]
  def change
    add_column :players, :starter, :boolean, :default => false
  end
end
