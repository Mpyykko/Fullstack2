const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')


const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Person = require('./models/person')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)


const Book = require('./models/book')
const Author = require('./models/author')


mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  {
    name: "Matti Luukkainen",
    phone: "040-432342",
    street: "Malminkaari 10 A",
    city: "Helsinki",
    id: '3d599470-3436-11e9-bc57-8b80ba54c431'
  },
  {
    name: "Venla Ruuska",
    street: "Nallemäentie 22 C",
    city: "Helsinki",
    id: '3d599471-3436-11e9-bc57-8b80ba54c431'
  },
]
let books = [
    { title: 'Clean Code', published: 2008, author: 'Robert Martin', id: "afa5b6f4-344d-11e9-a414-719c6709cf3e", genres: ['refactoring'] },
    { title: 'Agile software development', published: 2002, author: 'Robert Martin', id: "afa5b6f5-344d-11e9-a414-719c6709cf3e", genres: ['agile', 'patterns', 'design'] },
    { title: 'Refactoring, edition 2', published: 2018, author: 'Martin Fowler', id: "afa5de00-344d-11e9-a414-719c6709cf3e", genres: ['refactoring'] },
    { title: 'Refactoring to patterns', published: 2008, author: 'Joshua Kerievsky', id: "afa5de01-344d-11e9-a414-719c6709cf3e", genres: ['refactoring', 'patterns'] },
    { title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby', published: 2012, author: 'Sandi Metz', id: "afa5de02-344d-11e9-a414-719c6709cf3e", genres: ['refactoring', 'design'] },
    { title: 'Crime and punishment', published: 1866, author: 'Fyodor Dostoevsky', id: "afa5de03-344d-11e9-a414-719c6709cf3e", genres: ['classic', 'crime'] },
    { title: 'Demons', published: 1872, author: 'Fyodor Dostoevsky', id: "afa5de04-344d-11e9-a414-719c6709cf3e", genres: ['classic', 'revolution'] }
  ]

  let authors = [
    {
      name: 'Robert Martin',
      id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
      born: 1952,
    },
    {
      name: 'Martin Fowler',
      id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
      born: 1963
    },
    {
      name: 'Fyodor Dostoevsky',
      id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
      born: 1821
    },
    { 
      name: 'Joshua Kerievsky', // birthyear not known
      id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    },
    { 
      name: 'Sandi Metz', // birthyear not known
      id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    },
  ]


const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    friends: [Person!]!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Address {
    street: String!
    city: String! 
  }

  enum YesNo {
    YES
    NO
  }

  type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}
    
  type Author {
    name: String!
    bookCount: Int!
    born: Int
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    personCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }
 
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(
      name: String!
      phone: String!
    ): Person

    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    
    login(
      username: String!
      password: String!
    ): Token  
    
    addAsFriend(
      name: String!
    ): User

  }

`


const resolvers = {
  Query: {
    bookCount: async () => {
      return Book.collection.countDocuments()
    },
    allBooks: async (root, args) => {
      let query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        query.author = author._id 
      }
      if (args.genre) {
        query.genres = { $in: [args.genre] }
      }
      const books = await Book.find(query).populate('author')

      return books
    },

    authorCount: async () => {
      return Author.collection.countDocuments()
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map(author => ({
        name: author.name,
        bookCount: Book.find({ author: author._id }).length,
        born: author.born || null,
      }))
    },

      personCount: async () => Person.collection.countDocuments(),
      allPersons: async (root, args, context) => {
      if (!args.phone) {
        return Person.find({})
      }
  
      return Person.find({ phone: { $exists: args.phone === 'YES'  }})
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  

    Person: {
      address: ({ street, city }) => {
        return {
          street,
          city,
        }
      },
    },

  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      } catch (error) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
  
      return person
    },

    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      person.phone = args.phone
      try {
        await person.save()
      } catch (error) {
        throw new GraphQLError('Editing number failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return person
    },

    createUser: async (root, args) => {
      const user = new User({ username: args.username })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })        
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    addAsFriend: async (root, args, { currentUser }) => {
      const nonFriendAlready = (person) => 
        !currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())
  
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        }) 
      }
  
      const person = await Person.findOne({ name: args.name })
      if ( nonFriendAlready(person) ) {
        currentUser.friends = currentUser.friends.concat(person)
      }
  
      await currentUser.save()
  
      return currentUser
    },


    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author, born: null })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Failed to save author', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const existingBook = await Book.findOne({ title: args.title })
      if (existingBook) {
        throw new GraphQLError('Book with this title already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error: 'Book with this title already exists'
          }
        })
      }

      const newBook = new Book({
        title: args.title,
        author: author._id,
        published: args.published,
        genres: args.genres,
      })
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
      return {
        title: newBook.title,
        published: newBook.published,
        author: {
          name: author.name,
          born: author.born,
        },
        genres: newBook.genres,
      }
    },
    
    editAuthor: async (root, args, context) => {
      const { name, setBornTo } = args
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Unauthorized', {
          extensions: {
            code: 'UNAUTHORIZED',
          }
        })
      }
    
      const author = await Author.findOne({ name })
      if (!author) {
        return null
      }
    
      author.born = setBornTo
    
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Failed to update author', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }

      return author
      }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})