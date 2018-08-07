# GraphQL-Server

Complete docs to setup the environment soon.

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



