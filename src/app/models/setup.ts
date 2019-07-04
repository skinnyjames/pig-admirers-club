import db from './../lib/db'

export namespace SetupModel {
  export function setupRequired() {
    return db.one('select exists(select id from artists limit 1)')
    .then((res: any) => {
      return !res.exists
    })
  }
}