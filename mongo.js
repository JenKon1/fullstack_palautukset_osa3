const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.6x869.mongodb.net/phonebook-app?retryWrites=true&w=majority`
  

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const addPerson = (name, number) => {
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

if (process.argv.length == 3) {
  console.log('phonebook:')
  showPeople()
} else if (process.argv.length == 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    addPerson(name, number)
} else {
    console.log('Too many parameters!')
    process.exit(1)
}
 
