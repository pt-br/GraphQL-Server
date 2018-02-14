# GraphQL-Server

Complete docs to setup the environment soon.

You can combine this boilerplate with my [Relay Modern Boilerplate](https://github.com/pt-br/relay-modern-boilerplate) (using Mongoose).

## GraphiQL queries/mutations examples:

### Fetch Phones

```
{
  viewer {
    phones {
      edges {
        node {
          _id
          model
          image
        }
      }
    }
  }
}
```


### Fetch Phone by ID

```
{
  viewer {
    phoneById(phoneId: "5a80bc02d5a72461d1b1bf1a") {
      _id
      model
      image
    }
  }
}
```

### Save a new Phone

```
mutation {
  addPhone(input: {model: "iPhone 6", image: "https://goo.gl/ndJdW9", clientMutationId: "123"}) {
    newPhone {
      _id
      model
      image
    }
  }
}
```

### Update a Phone

```
mutation {
  updatePhone(input: {phoneId: "5a80bc02d5a72461d1b1bf1a", phoneModel: "iPhone X", phoneImage: "https://img.ibxk.com.br/2017/09/12/12174513097144.jpg", clientMutationId: "123"}) {
    updatedPhone {
      _id
      image
      model
    }
  }
}
```

### Remove a Phone

```
mutation {
  removePhone (input: {phoneId: "5a80bc02d5a72461d1b1bf1a", clientMutationId: "123"}) {
    removedPhoneMessage
    removedPhoneId
  }
}
```

