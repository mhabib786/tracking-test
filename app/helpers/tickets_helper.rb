module TicketsHelper
  def format_time_logged(total_hours)
    return "0h" if total_hours.nil? || total_hours <= 0

    days = total_hours / 24
    hours = total_hours % 24

    formatted = []
    formatted << "#{days}d" if days > 0
    formatted << "#{hours}h" if hours > 0

    formatted.join
  end

  def icon_color(ticket_type)
    case ticket_type
    when 'story' then 'green-500'
    when 'fix' then 'red-500'
    when 'request' then 'yellow-500'
    else 'gray-500'
    end
  end
end
