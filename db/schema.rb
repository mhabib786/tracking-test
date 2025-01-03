# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_12_12_065537) do
  create_table "tickets", force: :cascade do |t|
    t.string "summary"
    t.integer "ticket_type"
    t.string "details"
    t.string "status"
    t.string "time_logged"
    t.datetime "start_time"
    t.datetime "end_time"
    t.string "notes"
    t.boolean "counter_type"
    t.integer "counter_status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
