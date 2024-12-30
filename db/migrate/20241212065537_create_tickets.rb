class CreateTickets < ActiveRecord::Migration[7.1]
  def change
    create_table :tickets do |t|
      t.string :summary
      t.integer :ticket_type
      t.string :details
      t.string :status
      t.string :time_logged
      t.datetime :start_time
      t.datetime :end_time
      t.string :notes
      t.boolean :counter_type
      t.integer :counter_status
      t.timestamps
    end
  end
end
