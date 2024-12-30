class TicketsController < ApplicationController
  def index
    @ticket = Ticket.new
    @tickets = Ticket.all
      flash[:alert] = nil 
      flash[:notice] = nil
  end

  def new
    @ticket = Ticket.new
  end

  def update
    @ticket = Ticket.find(params[:id])
    if @ticket.update!(notes: params.dig(:ticket, :notes), time_logged: params.dig(:ticket, :time_logged))
      flash[:alert] = nil
      flash[:notice] = "Ticket was successfully updated."
      redirect_to tickets_path
    else
      flash[:notice] = nil
      flash[:alert] = "Failed to update the ticket."
      redirect_to request.referrer
    end
  end

  def create
    @ticket = Ticket.new(ticket_params)
    if @ticket.save
      flash[:alert] = nil
      flash[:notice] = "Ticket was successfully created."

      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.append("ticket_list", partial: "tickets/ticket_row", locals: { ticket: @ticket }),
            turbo_stream.update("flash", partial: "tickets/flash_messages"),
          ]
        end
      end
    else
      flash[:notice] = nil
      flash[:alert] = "There was an error creating the ticket."
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: [
            turbo_stream.update("form_container", partial: "tickets/form", locals: { ticket: @ticket }),
            turbo_stream.update("flash", partial: "tickets/flash_messages"),
          ]
        end
      end
    end
  end

  def show
    @ticket = Ticket.find(params[:id])

    respond_to do |format|
      format.html { render partial: "tickets/show", locals: { ticket: @ticket } }

      format.turbo_stream do
        render turbo_stream: turbo_stream.append("ticket_show", partial: "tickets/show", locals: { ticket: @ticket })
      end
    end
  rescue ActiveRecord::RecordNotFound
    render status: :not_found, plain: "Ticket not found"
  end

  def update_start_time
    @ticket = Ticket.find(params[:id])
    if params[:flag] == false
      new_time = Time.now - (params[:hours].to_i.hours + params[:minutes].to_i.minutes + params[:seconds].to_i.seconds)
      @ticket.update!(start_time: new_time, counter_type: params[:flag], counter_status: 1)
    else
      new_time = Time.now + params[:hours].to_i.hours + params[:minutes].to_i.minutes + params[:seconds].to_i.seconds
      @ticket.update!(end_time: new_time, counter_type: params[:flag], counter_status: 1)
    end
    head :ok
  end

  def stop_timmer
    @ticket = Ticket.find(params[:id])
    if params[:flag]
      @ticket.update!(start_time: Time.now, counter_type: params[:flag], counter_status: 2)
    else
      @ticket.update!(end_time: Time.now, counter_type: params[:flag], counter_status: 2)
    end
    head :ok
  end

  def resume_timer
    @ticket = Ticket.find(params[:id])
    if params[:flag]
      time_difference = Time.now - @ticket.start_time
      @ticket.update!(start_time: nil, counter_type: params[:flag], counter_status: 1, end_time: @ticket.end_time + time_difference.to_i)
    else
      time_difference = Time.now - @ticket.end_time
      @ticket.update!(end_time: nil, counter_type: params[:flag], counter_status: 1, start_time: @ticket.start_time + time_difference.to_i)
    end
    head :ok
  end

  def reset_timer
    @ticket = Ticket.find(params[:id])
    @ticket.update!(end_time: nil, start_time: nil, counter_status: 0)
    head :ok
  end

  private

  def ticket_params
    params.require(:ticket).permit(:ticket_type, :summary, :details, :time_logged)
  end

  def convert_input
    if @ticket.time_logged.to_f >= 24
      days = (@ticket.time_logged.to_f / 24).to_i
      hours = (@ticket.time_logged.to_f % 24).to_i
      minutes = ((@ticket.time_logged.to_f - days * 24 - hours) * 60).round
      result = "#{days}d"
      result += "#{hours}h" if hours > 0
      result += "#{minutes}m" if minutes > 0
      @ticket.time_logged = result
    elsif @ticket.time_logged.to_f >= 1
      hours = @ticket.time_logged.to_i
      minutes = ((@ticket.time_logged.to_f - hours) * 60).round
      if minutes == 0
        @ticket.time_logged = "#{hours}h"
      else
        @ticket.time_logged = "#{hours}h#{minutes}m"
      end
    elsif @ticket.time_logged.to_f >= 0.01
      minutes = (@ticket.time_logged.to_f * 60).round
      @ticket.time_logged = "#{minutes}m"
    end
  end
end
