const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)  

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model('Person', personSchema)

/*const addPerson = (name, number) => {
    const person = new Person({name, number})
    person.save().then(response => {
        console.log('added', name, 'number', number, 'to phonebook')
        mongoose.connection.close()
      })
}

const showPeople = () => {
    Person.find({}).then(persons => {
      persons.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}
*/
module.exports = mongoose.model('Person', personSchema)