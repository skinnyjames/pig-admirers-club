import db from './../lib/db'
import { create } from 'domain';
import Validator from './../lib/validator'
import { ValidationError } from '../lib/errors'

interface ConceptData {
  
}

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

const $concept = {
  byUser(id: Number) {
    let sql = 'select c.*, o.* from concepts as c left join orders as o where c.artist_id = ${id}'
    return db.any(sql, {id: id})
  },
  async create(data: any) {
    let errors = newConceptSchema.validate(data)
    if (errors.length > 0) {
      throw new ValidationError('Please correct the following errors', errors)
    }
  }
}

export = $concept