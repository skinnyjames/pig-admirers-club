
interface RegexRule{ 
  [k: string]: RegExp
}
interface LengthRule{
  [k: string]: string
}
interface Rules{
  presence?: Array<string>
  regex?: RegexRule,
  length?: LengthRule,
  custom?: Array<Function>
}

interface ValidationError{
  field: string,
  message: string
}

class Validator{
  
  rules: Rules
  errors: Array<ValidationError>

  constructor(rules: Rules){
    this.rules = rules;
    this.errors = [];
  }
  
  validate(things: any){
    // validate presence
    this.errors = [];
    if(this.rules.presence && this.rules.presence.length > 0){
      for(let i=0;i<this.rules.presence.length;i++){
        if(!things[this.rules.presence[i]]){
          this.errors.push({
            field: this.rules.presence[i],
            message: this.rules.presence[i] + ' must be present'
          });
        }
      }
    }
    // validate regex
    if (this.rules.regex){
      for(let x in this.rules.regex){
        if(things[x] && !this.rules.regex[x].test(things[x])) {
          this.errors.push({
            field: x,
            message: x + ' is invalid'
          });
        }
      }
    }
    
    // validate length
    if (this.rules['length']){
      for(let x in this.rules['length']){
        let [symbol, valueString] = this.rules['length'][x].split(' ')
        let value: Number = parseInt(valueString)
        switch(symbol){
          case '=':
            if(!(things[x].length === value)){
              this.errors.push({
                field: x,
                message: x + ' must be ' + value + ' characters long'
              });
              break;
            }
          case '>':
            if(!(things[x].length > value)){
              this.errors.push({
                field: x,
                message: x + ' must be greater than ' + value + ' characters'
              });
              break;
            }
          case '<':
          if(!(things[x].length < value)){
              this.errors.push({
                field: x,
                message: x + ' must be less than ' + value + ' characters'
              });
              break;
          }
        }
      }
    }
    
    //validate custom functions
    if (this.rules.custom && this.rules.custom.length > 0){
      for(let i=0;i<this.rules.custom.length; i++){
        let customError: any = this.rules.custom[i](things);
        if(!customError.condition){
          customError.fields.forEach((field: string) => {
            this.errors.push({
              field: field, 
              message: customError.message
            })
          })
        }
      }
    }
    
    // return errors if there are any
    if(this.errors){
      return this.errors
    }else{
      return null;
    }
  }
}

export = Validator