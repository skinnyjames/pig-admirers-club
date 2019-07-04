import db from './../lib/db'
import Validator from './../lib/validator'
import { ValidationError } from '../lib/errors'


const newConceptSchema = new Validator({
  presence: ['media', 'description', 'price'],
  custom: [ 
    (conceptData: any) => {
      let price = parseFloat(conceptData.price)
      return {
        condition: (!isNaN(price)), 
        fields: ['price'],
        message: 'Price must be a valid price'
      }
    }
  ]
})

export namespace ConceptModel {
  export function all() {
    let sql = `select c.*, (o.id IS NOT NULL) as has_order, array_to_json(array_agg(row_to_json(ci.*))) as images, 
    a.id as artist_id, a.first_name, a.last_name
    from concepts as c left join concept_images as ci on c.id = ci.concept_id
    inner join artists as a on c.artist_id = a.id
    left join orders as o on o.concept_id = c.id
    group by c.id, a.id, o.id`
    return db.any(sql)
  }

  export function get(id: Number) {
    let sql = 'select c.*, o.id as order_id from concepts as c left join orders as o on o.concept_id = c.id where c.id = ${id}'
    return db.one(sql, {id: id})
  }

  export function byUser(id: Number) {
    let sql = 'select c.*, o.id as order_id from concepts as c left join orders as o on o.concept_id = c.id where c.artist_id = ${id}'
    return db.any(sql, {id: id})
  }

  export async function destroy(id: Number): Promise<void> {
    await db.none('delete from concept_images where concept_id = ${id}', {id: id})
    let sql = 'delete from concepts where id = ${id}'
    return db.none(sql, {id: id})
  }
  export async function images(id: Number) {
    let sql = 'select * from concept_images where concept_id = ${id}'
    return db.any(sql, {id: id})
  }

  export async function create(data: any): Promise<Number> {
    let errors = newConceptSchema.validate(data)
    if (errors.length > 0) {
      throw new ValidationError('Please correct the following errors', errors)
    } else {
      data.title = data.title ? data.title : 'Untitled'
      let sql = 'insert into concepts (artist_id, title, media, description, price)' +
      ' values (${artistId}, ${title}, ${media}, ${description}, ${price}) returning id'
      let result = await db.one(sql, data)
      return result.id
    }
  }

  export async function createImages(id: Number, files: Array<any>) {
    let params = files.map((file: any) => {
      return { imageName: file.filename, id: id }
    })
    return db.tx(transaction => {
      const queries = params.map((param: any) => {
        let sql = 'insert into concept_images (concept_id, image_name) values (${id}, ${imageName})'
        return transaction.none(sql, param)
      })
      return transaction.batch(queries)
    })
  }
}