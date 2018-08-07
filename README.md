# GraphQL-Server

This is a GraphQL server built with Apollo Server and uses mock data for reference.

You can combine this boilerplate with my [apollo boilerplate](https://github.com/pt-br/apollo-boilerplate).

## GraphiQL queries/mutations examples:

### Fetch Posts

```
{
  posts {
    id
    title
    votes
    author {
      firstName
      lastName
    }
  }
}
```


### Upvote a Post

```
mutation {
  upvotePost(postId: 1) {
    id
    title
    votes
  }
}
```



