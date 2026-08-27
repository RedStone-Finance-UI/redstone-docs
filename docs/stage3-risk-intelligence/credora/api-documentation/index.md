# Credora GraphQL API Documentation

Credora GraphQL APIs expose ratings information alongside unique data points, powering risk management across protocols, asset managers, and active onchain participants.

## Endpoint

**https://api.credora.io/graphql**

Developers can use standard POST requests to query the endpoint with a GraphQL query.  
You can use tools like Postman, Insomnia, or GraphQL playgrounds to explore and test queries.

---

## Authentication

### Requesting API Access

Accessing Credora APIs requires whitelisted access.  
You can request access via this **[Google Form](https://docs.google.com/forms/d/e/1FAIpQLSep4TmedhA8VKaDH3OQuIaqWtcY3nI_ro2T7269ZSN9IHL4cA/viewform)**.

### API Keys

Once approved, you will receive:

- **Client API Key:** Your unique authentication credential

Keep your API key secure and never expose it in client-side code or public repositories.

---

### Authentication Header

All GraphQL requests must include the following HTTP header:

`ClientSecret: your-api-key`

### Authentication Errors

Requests without a valid API key will return:

```json
{
  "errors": [
    {
      "message": "Unauthorized: Invalid or missing API key",
      "extensions": {
        "code": "UNAUTHENTICATED",
        "hint": "Provide a valid API key in the 'ClientSecret' header"
      }
    }
  ]
}
```
