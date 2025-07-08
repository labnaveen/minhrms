import { NextFunction, Request, Response } from "express";
import {Includeable, Model, Op, WhereOptions} from 'sequelize'
import { badRequest } from "../../services/error/BadRequest";
import { IMasterControllerOptions } from "../masterController";
import { generateResponse } from "../../services/response/response";

export const DropdownController = (
  model: typeof Model,
  // Add more models as needed
) => {
  const getAllDropdown = async (
    req: Request,
    res: Response,
    next: NextFunction,
    options?: IMasterControllerOptions,
  ): Promise<void> => {
    try {
      const findOptions = options || {} as any;

      findOptions.searchBy = options?.searchBy
      findOptions.included = options?.included
      findOptions.order = options?.sortBy?.map((field) => [field, 'DESC'])

      if(options?.searchBy && options.searchBy.length > 0){
        const searchConditions: WhereOptions[] = options.searchBy.map((field) => ({
          [field]: {[Op.like]: `%${req.query.search}%` },
        }));

        findOptions.where={
          [Op.or]: searchConditions
        }

        console.log(searchConditions)

      }

      if(options?.where){
        findOptions.where = options.where
      }

      if(options?.included){
        findOptions.include = options.included.map((relation) => {
          const nestedIncluded = options.nestedIncluded?.[relation];
          const attributes = options.attributes?.[relation];
          
          if(nestedIncluded){
            return{
              model: model.sequelize?.model(relation),
              include: nestedIncluded.map((nestedRelation) => ({
                model: model.sequelize?.model(nestedRelation),
              })),
            };
          }else if(attributes){
            return{
              model: model.sequelize?.model(relation),
              attributes: attributes.map((attribute) => {
                return attribute
              })
            };
          }else{
            return{
              model: model.sequelize?.model(relation)
            }
          } 
        }) as Includeable[]
      }

      if(options?.attribute){
        findOptions.attributes = options.attribute
      }


      //@ts-ignore
      const data = await model.findAndCountAll(findOptions);
      const result = {
        data: data.rows,
      };

      const response = generateResponse(200, true, "Dropdown fetched succesfull", data.rows)

      if (data) {
        res.status(200).json(response);
      } else {
        next(badRequest('There is no data!'));
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  // Return the controller methods
  return {
    getAllDropdown,
    // Add more methods for other models
  };
};
