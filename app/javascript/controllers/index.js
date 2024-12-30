// This file is auto-generated by ./bin/rails stimulus:manifest:update
// Run that command whenever you add a new controller or create them with
// ./bin/rails generate stimulus controllerName

import { application } from "./application";

import FlashController from "./flash_controller";
application.register("flash", FlashController);

import FormSwapController from "./form_swap_controller";
application.register("form-swap", FormSwapController);

import TicketTypeController from "./ticket_type_controller";
application.register("ticket-type", TicketTypeController);

import TimeTrackingController from "./time_tracking_controller";
application.register("time-tracking", TimeTrackingController);
