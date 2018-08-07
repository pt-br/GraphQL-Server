# GraphQL-Server

This is a GraphQL server built with Apollo Server and a MongoDB database for reference.

You can combine this boilerplate with my [apollo boilerplate](https://github.com/pt-br/apollo-boilerplate).

## MongoDB schema

In case you want to run this right after cloning, make sure to config your database credentials under `/mongoose/` and replicate the following DB configs:

* Database name: graphql
* Collection name: phones
* Collection structure:

```
{
	"_id" : ObjectId("5a80bd36d5a72461d1b1bf1b"),
	"image" : "https://goo.gl/uanrHM",
	"model" : "Galaxy S7"
}
```

## Playground queries/mutations examples:

### Fetch Phones

```
{
  phones {
    id
    model
    image
  }
}
```


### Fetch Phones by ID

```
{
  phones(id: "5a80bd36d5a72461d1b1bf1b") {
    id
    model
    image
  }
}
```

### Add a new Phone

```
mutation {
  addPhone(model: "iPhone 6", image: "https://goo.gl/ndJdW9") {
    model
    id
    image
  }
}
```

### Update an existing Phone

```
mutation {
  updatePhone(id: "5b691e72981cb265298a4ed2", model: "iPhone X", image: "https://img.ibxk.com.br/2017/09/12/12174513097144.jpg") {
    id
    image
    model
  }
}
```

### Remove a Phone

```
mutation {
  removePhone(id: "5b691e72981cb265298a4ed2") {
    id
    image
    model
  }
}
```



