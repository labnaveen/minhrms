import { NextFunction, Request, Response } from 'express';
import { Model, FindOptions, UpdateOptions, DestroyOptions, WhereAttributeHash, WhereOptions, Includeable, Op, FindAttributeOptions } from 'sequelize';
import { badRequest } from '../services/error/BadRequest';
import { notFound } from '../services/error/NotFound';
import { generateResponse } from '../services/response/response';

export type MasterController<T extends Model> = {
  getAll: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
  getAllDropdown: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
  getById: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
  create: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
  update: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
  destroy: (req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions) => Promise<void>;
};

//@ts-ignore
export interface IMasterControllerOptions extends FindOptions{
  id?: string | Record<string, string>
  searchBy?: string[]
  createWith?: string[]
  updateWith?: string[]
  included?: string[]
  sortBy?: string[]
  uniqueBy?: string[]
  permittedFilterOps?: Record<string, any>;
  where?: WhereAttributeHash | WhereOptions<any>;
  offset?: number;
  limit?: number;
  nestedIncluded?: { [relation: string]: string[] };
  excluded?: { [relation: string]: string[]};
  attributes?: {[relation: string]: string[]};
  attribute?: FindAttributeOptions;
  aliases?:{[relation: string]: string};
}

export function MasterController<T extends Model>(
  model: { new(): T } & typeof Model
): MasterController<T> {

  async function getAll(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions):Promise<void> {
      try {
        const findOptions: IMasterControllerOptions | any = options || {}; //Can add Options such as where, attributes, etc.
        const { page, records } = req.query as { page: string, records: string };

        if (!page && !records) {
          // res.status(400).json({message: "No request parameters are present!"})
          next(badRequest("No request parameters are present!"))
          return
        }


        const pageNumber = parseInt(page)
        const recordsPerPage = parseInt(records)

        const offset = (pageNumber - 1) * recordsPerPage;


        findOptions.searchBy = options?.searchBy
        findOptions.included = options?.included
        findOptions.order = options?.sortBy?.map((field) => [field, 'DESC'])
        findOptions.offset = offset
        findOptions.limit = recordsPerPage
        findOptions.distinct = true

        if(req.query.search_term){
          if(options?.searchBy && options.searchBy.length > 0){
            const searchConditions: WhereOptions[] = options.searchBy.map((field) => ({
              [field]: {[Op.like]: `%${req.query.search_term}%` },
            }));

            findOptions.where={
              [Op.or]: searchConditions
            }
          }
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
                }),
              };
            }else{
              return{
                model: model.sequelize?.model(relation),
              }
            } 
          }) as Includeable[]
        }


        
        // const data = await model.findAndCountAll({
        //   offset,
        //   limit: recordsPerPage,
        // });

        // console.log(findOptions)


        const data = await model.findAndCountAll(findOptions);

        const totalPages = Math.ceil(data.count / recordsPerPage)
        const hasNextPage = pageNumber < totalPages;
        const hasPrevPage = pageNumber > 1;



        const meta = {
          totalCount: data.count,
          pageCount: totalPages,
          currentPage: page,
          perPage: recordsPerPage,
          hasNextPage,
          hasPrevPage
        }

        const result = {
          data: data.rows,
          meta
        }

        const response = generateResponse(200, true, "Data Fetched Succesfully!", result.data, meta)


        if (data) {
          res.status(200).json(response);
        }
        else {
          // res.status(404).json({error: 'There are no companies!'})
          next(badRequest("There are no companies!"))
        }
      } catch (err) {
        console.log(err)
        res.status(500).json(err);
        // next(internalServerError("Something Went Wrong!"))
      }
  }

  async function getById(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> {
    try {
      const id = Number(req.params.id);
      const findOptions: IMasterControllerOptions | any = options || {} //Can add Options here such as 'attributes' etc.

      findOptions.where = { id };

      // if (options?.included) {
      //   findOptions.include = options.included.map((relation) => ({
      //     model: model?.sequelize?.models[relation],
      //     // through: {
      //     //   attributes: [], // Exclude join table attributes from the result
      //     // },
      //   }));
      // }

      if(options?.included){
        findOptions.include = options.included.map((relation) => {
          const nestedIncluded = options.nestedIncluded?.[relation];
          const attributes = options.attributes?.[relation];
          const alias = options.aliases?.[relation];
          
          if(nestedIncluded){
            return{
              model: model.sequelize?.model(relation),
              as: alias,
              include: nestedIncluded.map((nestedRelation) => ({
                model: model.sequelize?.model(nestedRelation),
              })),
            };
          }else if(attributes){
            return{
              model: model.sequelize?.model(relation),
              as: alias,
              attributes: attributes.map((attribute) => {
                return attribute
              }),
              through:{attributes:[]}
            };
          }else{
            return{
              model: model.sequelize?.model(relation),
              as: alias,
            }
          } 
        }) as Includeable[]
      }

      if(options?.attribute){
        findOptions.attributes = options.attribute
      }

      const data = await model.findOne(findOptions);

      const response = generateResponse(200, true,  "Record Fetched Succesfully!", data)

      res.status(200).json(response);


    } catch (err) {
      console.log(err)
      res.status(500).json(err);
      // next(internalServerError("Something Went Wrong!"))
    }
  }

  async function create(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> {
    try {
      const data = await model.create(req.body as Record<string, unknown>);
      const response = generateResponse(201, true, "Created succesfully!", data)
      res.status(201).json(response);
    } catch (err) {
      res.status(500).json(err);
      // next(internalServerError("Something Went Wrong!"))
    }
  }

  async function update(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> {
    try {
      const id = Number(req.params.id);
      const options: UpdateOptions = { where: { id } };
      const [numsRowsUpdated] = await model.update(req.body as Partial<T>, options);

      if (numsRowsUpdated === 0) {
        // res.status(404).json({ message: `No ${model.name} record found with id ${id}` });
        next(notFound(`No ${model.name} record found with id ${id}`))
      } else {
        const updatedData = await model.findByPk(id);

        const response = generateResponse(200, true, "Updated succesfully!", updatedData)
        res.status(200).json(response);
      }
    } catch (err) {
      res.status(500).json(err);
      // next(internalServerError("Something Went Wrong!"))
    }
  }

  async function destroy(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> {
    try {
      const id = Number(req.params.id);

      // const isReferenced = await MasterPolicy.findOne({
      //   where{ id: id }
      // })
      const options: DestroyOptions = { where: { id } };
      await model.destroy(options);
      const response = generateResponse(200, true, "Deleted Succesfully!")
      res.status(200).json(response);
    } catch (err) {
      res.status(500).json(err);
      // next(internalServerError("Something Went Wrong!"))
    }
  }


  /**********Shikha  */


  async function getAllDropdown(req: Request, res: Response, next: NextFunction, options?: IMasterControllerOptions): Promise<void> {
    try {
      const data = await model.findAndCountAll({
      });

      const result = {
        data: data.rows,
      }

      const response = generateResponse(200, true, "Dropdown fetched succesfully!", result)

      if (data) {
        res.status(200).json(response);
      }
      else {
        next(badRequest("There are no data!"))
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }





  /* shikha  */



  return { getAll, getAllDropdown, getById, create, update, destroy };

}
