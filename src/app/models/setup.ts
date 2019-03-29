import db from './../lib/db'

const $setup = {
  setupRequired() {
    return db.one('select exists(select id from artists limit 1)')
    .then((res: any) => {
      return !res.exists
    })
  }
}

export = $setup
