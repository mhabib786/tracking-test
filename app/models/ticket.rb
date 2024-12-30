class Ticket < ApplicationRecord
  validates :summary, presence: true
  validates :ticket_type, presence: true
  enum :ticket_type, { story: 0, fix: 1, request: 2 }
  enum :counter_status, { reset_status: 0, start: 1, stop: 2, resume: 3 }
  # validate :summary_word_limit

  def summary_word_limit
    if summary.present? && summary.split.size > 25
      errors.add(:summary, "cannot exceed 50 words")
    end
  end

  def formatted_time
    if counter_type == true && counter_status == "start"
      time_difference = end_time - Time.now
      time_difference = [time_difference, 0].max
      hours = (time_difference / 3600).to_i
      minutes = ((time_difference % 3600) / 60).to_i
      seconds = (time_difference % 60).to_i
      Time.zone.local(2000, 1, 1, hours, minutes, seconds)
    elsif counter_type == true && counter_status == "stop"
      time_difference = end_time - start_time
      time_difference = [time_difference, 0].max
      hours = (time_difference / 3600).to_i
      minutes = ((time_difference % 3600) / 60).to_i
      seconds = (time_difference % 60).to_i
      Time.zone.local(2000, 1, 1, hours, minutes, seconds)
    elsif counter_type == false && counter_status == "start"
      time_difference = Time.now - start_time
      time_difference = [time_difference, 0].max
      hours = (time_difference / 3600).to_i
      minutes = ((time_difference % 3600) / 60).to_i
      seconds = (time_difference % 60).to_i
      Time.zone.local(2000, 1, 1, hours, minutes, seconds)
    elsif counter_type == false && counter_status == "stop"
      time_difference = end_time - start_time
      time_difference = [time_difference, 0].max
      hours = (time_difference / 3600).to_i
      minutes = ((time_difference % 3600) / 60).to_i
      seconds = (time_difference % 60).to_i
      Time.zone.local(2000, 1, 1, hours, minutes, seconds)
    end
  end
end
