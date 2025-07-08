import Joi, { date } from "joi";

export const AnnouncementCreationSchema = Joi.object({
  title: Joi.string().required(),
  suspendable: Joi.boolean().optional(),
  group_specific: Joi.boolean().optional(),
  start_date: Joi.when('suspendable', {is: true, then: Joi.date().required(), otherwise: Joi.date().optional()}).optional(),
  end_date: Joi.when('suspendable', {is: true, then: Joi.date().required(), otherwise: Joi.date().optional()}).optional(),
  description: Joi.string().optional(),
  units: Joi.array().items(Joi.number()).optional()
})